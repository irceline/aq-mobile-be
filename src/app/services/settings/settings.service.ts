import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { LatLngBoundsExpression, Layer } from 'leaflet';

export interface MobileSettings extends Settings {
  visiblePhenomenonIDs: string[];
  ircelineSettingsUrl: string;
  ircelineAQIndexUrl: string;
  clusterStationsOnMap: boolean;
  phenomenonLayerMapping: PhenomenonLayerMapping[];
  regions: string[];
  geoSearchCountryCodes: string[];
  defaultBbox: LatLngBoundsExpression;
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
    const settings: MobileSettings = require('../../../assets/settings.json');
    if (settings.clusterStationsOnMap === undefined) { settings.clusterStationsOnMap = true; }
    if (settings.limitOfAllowedUserLocations === undefined) { settings.limitOfAllowedUserLocations = 5; }
    this.setSettings(settings);
  }

}
