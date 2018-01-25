import { Injectable } from '@angular/core';
import { LayerOptions, SettingsService } from 'helgoland-toolbox';
import * as L from 'leaflet';

import { MobileSettings } from '../settings/settings';

@Injectable()
export class LayerGeneratorService {

  constructor(
    private settingsService: SettingsService<MobileSettings>
  ) { }

  public getLayersForPhenomenon(id: string, time: Date): Map<LayerOptions, L.Layer> {
    const layers = new Map<LayerOptions, L.Layer>();
    if (id && time) {
      const layerMapping = this.settingsService.getSettings().phenomenonLayerMapping.find(e => e.id === id);
      if (layerMapping) {
        layerMapping.layers.forEach(l => {
          const layerOptions = l.layer;
          layerOptions['time'] = time.toISOString();
          layers.set({ name: l.label, visible: l.visible }, L.tileLayer.wms(l.baseUrl, layerOptions))
        })
      }
    }
    return layers;
  }

}
