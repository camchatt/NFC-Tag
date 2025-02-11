import { Observable, Utils } from '@nativescript/core';
import { Nfc, NfcNdefData } from '@nativescript/nfc';

export class HelloWorldModel extends Observable {
  private nfc: Nfc;
  private _name: string = '';
  private _email: string = '';
  private _status: string = 'Ready to write NFC tag';

  constructor() {
    super();
    this.nfc = new Nfc();
    this.initNfc();
  }

  private async initNfc() {
    try {
      const available = await this.nfc.available();
      if (!available) {
        this.status = 'NFC is not available on this device';
        return;
      }

      const enabled = await this.nfc.enabled();
      if (!enabled) {
        this.status = 'Please enable NFC in your device settings';
        if (Utils.android) {
          await this.nfc.showSettings();
        }
        return;
      }

      this.status = 'NFC is ready. Enter your details and tap Write.';
    } catch (error) {
      this.status = `Error initializing NFC: ${error.message}`;
      console.error(error);
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (this._name !== value) {
      this._name = value;
      this.notifyPropertyChange('name', value);
    }
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (this._email !== value) {
      this._email = value;
      this.notifyPropertyChange('email', value);
    }
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    if (this._status !== value) {
      this._status = value;
      this.notifyPropertyChange('status', value);
    }
  }

  async writeTag() {
    try {
      if (!this.name || !this.email) {
        this.status = 'Please enter both name and email';
        return;
      }

      const available = await this.nfc.available();
      if (!available) {
        this.status = 'NFC is not available on this device';
        return;
      }

      const enabled = await this.nfc.enabled();
      if (!enabled) {
        this.status = 'Please enable NFC in your device settings';
        if (Utils.android) {
          await this.nfc.showSettings();
        }
        return;
      }

      const payload = `BEGIN:VCARD\nVERSION:3.0\nFN:${this.name}\nN:${this.name};;;\nEMAIL:${this.email}\nEND:VCARD`;

      this.status = 'Ready to write. Please hold an NFC tag near the device...';

      await this.nfc.writeTag({
        textRecords: [{
          text: payload,
          id: [],
          languageCode: 'en'
        }]
      });

      this.status = 'Successfully wrote to NFC tag!';
    } catch (error) {
      this.status = `Error: ${error.message}`;
      console.error(error);
    }
  }
}