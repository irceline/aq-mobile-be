import { Injectable } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { LayerOptions } from '@helgoland/map';
import * as L from 'leaflet';

import { MobileSettings } from '../settings/settings';

@Injectable()
export class LayerGeneratorService {

  constructor(
    private settingsService: SettingsService<MobileSettings>
  ) { }

  public getLayersForPhenomenon(id: string, time: Date, hideStationary: boolean = false): Map<string, LayerOptions> {
    const layers = new Map<string, LayerOptions>();
    if (id && time) {
      const layerMapping = this.settingsService.getSettings().phenomenonLayerMapping.find(e => e.id === id);
      if (layerMapping) {
        layerMapping.layers.forEach(l => {
          if (!l.stations || !hideStationary) {
            const layerOptions = l.layer;
            layerOptions['time'] = time.toISOString();
            layers.set(l.label,
              {
                label: l.label,
                visible: l.visible,
                layer: L.tileLayer.wms(l.baseUrl, layerOptions)
              }
            )
          }
        });
      }
      return layers;
    }
  }

}
