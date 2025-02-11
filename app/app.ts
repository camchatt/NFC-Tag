import { Application } from '@nativescript/core';
import { Nfc } from '@nativescript/nfc';

// Request NFC permissions on app start
if (global.isAndroid) {
    Application.android.on(Application.AndroidApplication.activityRequestPermissionsEvent, (args: any) => {
        for (let i = 0; i < args.permissions.length; i++) {
            if (args.grantResults[i] === android.content.pm.PackageManager.PERMISSION_DENIED) {
                console.log("Permission denied");
                return;
            }
        }
        console.log("Permissions granted");
    });
}

Application.run({ moduleName: 'app-root' });