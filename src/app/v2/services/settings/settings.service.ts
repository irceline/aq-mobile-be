import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { Layer } from 'leaflet';

import settingsJson from '../../../../assets/settings.json';

export interface MobileSettings extends Settings {
  visiblePhenomenonIDs: string[];
  ircelineSettingsUrl: string;
  ircelineAQIndexUrl: string;
  clusterStationsOnMap: boolean;
  regions: string[];
  geoSearchCountryCodes: string[];
  personalAlert: PersonalAlert[];
  colorizedMarkerForLastMilliseconds: number;
  nearestStationTimeBufferInMillseconds: number;
  limitOfAllowedUserLocations: number;
}

export interface PersonalAlert {
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
  layer: Layer;
  stations: boolean;
}

@Injectable()
export class JSSONSettingsService extends SettingsService<MobileSettings> {

  constructor() {
    super();
    const settings: MobileSettings = settingsJson;
    if (settings.clusterStationsOnMap === undefined) { settings.clusterStationsOnMap = true; }
    if (settings.limitOfAllowedUserLocations === undefined) { settings.limitOfAllowedUserLocations = 5; }
    this.setSettings(settings);
  }

}
