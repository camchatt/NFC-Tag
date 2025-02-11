const { resolve } = require("path");
const webpack = require("@nativescript/webpack");
const os = require("os");

module.exports = (env) => {
    // Initialize the NativeScript webpack config
    webpack.init(env);

    // Handle optional externals path
    //let externalsPath;
    if (env && typeof env.externals === "string") {
        // Tilde expansion: replace ~ with the user's home directory
        if (env.externals.startsWith("~")) {
            const stripped = env.externals.substring(1); // remove '~'
            externalsPath = resolve(os.homedir(), stripped);
        } else {
            externalsPath = resolve(env.externals);
        }

        console.log(`Externals path detected: ${externalsPath}`);
    } else {
        // Provide a helpful message if no valid path is passed
        console.log("No valid '--env externals=<path>' provided. Skipping externals logic.");
    }

    // Chain additional webpack configuration
    webpack.chainWebpack((config) => {
        // Enable tree-shaking (removes unused code)
        config.optimization.minimize(true);

        // Enable code splitting (reduces bundle size)
        config.optimization.splitChunks({
            chunks: "all",
            minSize: 50000,
            maxSize: 250000,
        });

        // Configure SCSS handling
        config.module
            .rule("scss")
            .test(/\.scss$/)
            // 1) Sass compilation
            .use("sass-loader")
            .loader("sass-loader")
            .end()
            // 2) Convert CSS to JSON for NativeScript
            .use("css-loader")
            .loader("@nativescript/webpack/helpers/css2json-loader")
            .end();
    });

    // Return the final config so NativeScript CLI can build properly
    return webpack.resolveConfig();
};
