import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { LayerOptions } from '@helgoland/map';
import { NavParams, ViewController } from 'ionic-angular';
import { tileLayer, TileLayerOptions } from 'leaflet';

import { AnnualMeanProvider } from '../../providers/annual-mean/annual-mean';
import { MobileSettings } from '../../providers/settings/settings';

@Component({
  selector: 'modal-annual-map',
  templateUrl: 'modal-annual-map.html'
})
export class ModalAnnualMapComponent {

  public mapId = 'annual-map';
  public fitBounds: L.LatLngBoundsExpression;
  public zoomControlOptions: L.Control.ZoomOptions = {};
  public layerControlOptions: L.Control.LayersOptions = { position: "bottomleft", hideSingleBase: true };
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  
  public year: string;
  public phenomenonLabel: string;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private annualMean: AnnualMeanProvider
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.fitBounds = settings.defaultBbox;
    this.setOverlayMap(this.params.get('phenomenon'));
  }

  private setOverlayMap(phenomenon) {
    this.annualMean.getYear().subscribe(year => {
      this.overlayMaps.clear();
      this.year = year;
      let layerId;
      this.phenomenonLabel = phenomenon;
      switch (phenomenon) {
        case 'NO2':
          layerId = `no2_anmean_${year}`;
          break;
        case 'O3':
          layerId = `o3_anmean_${year}`;
          break;
        case 'PM10':
          layerId = `pm10_anmean_${year}`;
          break;
        case 'PM25':
          layerId = `pm25_anmean_${year}`;
          break;
        case 'BC':
          layerId = `bc_anmean_${year}`;
          break;
        default:
          break;
      }
      const wmsUrl = `http://geo.irceline.be/rioifdm/${layerId}/wms`;;
      const layerOptions: TileLayerOptions = {
        layers: layerId,
        transparent: true,
        format: 'image/png',
        opacity: 0.7,
        useBoundaryGreaterAsZoom: 12
      }
      this.overlayMaps.set(wmsUrl + layerId, {
        label: 'layer',
        visible: true,
        layer: tileLayer.wms(wmsUrl, layerOptions)
      })
    })
  }

  public onPhenomenonChange(): void {
    this.setOverlayMap(this.phenomenonLabel);
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

}
