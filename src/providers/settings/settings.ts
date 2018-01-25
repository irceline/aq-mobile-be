import { Injectable } from '@angular/core';
import { Settings, SettingsService } from 'helgoland-toolbox';

export interface MobileSettings extends Settings {
    visiblePhenomenonIDs: string[];
    ircelineSettingsUrl: string;
    clusterStationsOnMap: boolean;
    phenomenonLayerMapping: PhenomenonLayerMapping[];
}

export interface PhenomenonLayerMapping {
    id: string;
    layers: LayerConfig[];
}

export interface LayerConfig {
    label: string;
    visible: boolean;
    baseUrl: string;
    layer: L.Layer;
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