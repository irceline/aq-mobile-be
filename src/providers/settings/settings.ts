import { Injectable } from '@angular/core';
import { Settings, SettingsService } from 'helgoland-toolbox';

export class MobileSettings extends Settings {
    public visiblePhenomenonIDs: string[];
    public ircelineSettingsUrl: string;
    public clusterStationsOnMap: boolean;
}

@Injectable()
export class JSSONSettingsService extends SettingsService<MobileSettings> {

    constructor() {
        super();
        const settings: MobileSettings = require('../../assets/settings.json');
        if (settings.clusterStationsOnMap === undefined) { settings.clusterStationsOnMap = true };
        this.setSettings(settings);
    }

}