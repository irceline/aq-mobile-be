import { Injectable } from '@angular/core';
import { Settings, SettingsService } from 'helgoland-toolbox';

export class MobileSettings extends Settings { 
    public visiblePhenomenonIDs: string[];
    public ircelineSettingsUrl: string;
}

@Injectable()
export class JSSONSettingsService extends SettingsService<MobileSettings> {

    constructor() {
        super();
        const settings = require('../../assets/settings.json');
        this.setSettings(settings);
    }

}