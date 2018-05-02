import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';

export interface MobileSettings extends Settings {
    visiblePhenomenonIDs: string[];
    ircelineSettingsUrl: string;
    ircelineAQIndexUrl: string;
    clusterStationsOnMap: boolean;
    phenomenonLayerMapping: PhenomenonLayerMapping[];
    regions: string[];
    geoSearchContryCodes: string[];
    defaultBbox: L.LatLngBoundsExpression;
    localnotifications: LocalNotification[];
}

export interface LocalNotification {
    period: number;
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
    stations: boolean;
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