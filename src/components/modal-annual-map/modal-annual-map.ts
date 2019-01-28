import { Component } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { LayerOptions, MapCache } from '@helgoland/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Control, DomUtil, LatLngExpression, popup, tileLayer, TileLayerOptions } from 'leaflet';

import { AnnualMeanProvider, AnnualPhenomenonMapping } from '../../providers/annual-mean/annual-mean';
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
  public legend: L.Control;
  public year: string;
  public phenomenonLabel: string;
  private legendVisible: boolean = false;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private settingsSrvc: SettingsService<MobileSettings>,
    private annualMean: AnnualMeanProvider,
    private mapCache: MapCache,
    private translate: TranslateService,
    private iab: InAppBrowser,
  ) { }

  public mapInitialized() {
    this.setOverlayMap(this.params.get('phenomenon'));
    const location = this.params.get('location') as GeoJSON.Point;
    if (location) {
      const label = this.translate.instant('map.configured-location');
      const point: LatLngExpression = { lng: location.coordinates[0], lat: location.coordinates[1] };
      this.mapCache.getMap(this.mapId).addLayer(
        popup({ autoPan: false })
          .setLatLng(point)
          .setContent(label)
      )
      this.mapCache.getMap(this.mapId).setView(point, 12);
    } else {
      this.fitBounds = this.settingsSrvc.getSettings().defaultBbox;
    }
    this.updateLegend();
  }

  public onPhenomenonChange(): void {
    this.setOverlayMap(this.phenomenonLabel);
    this.updateLegend();
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  private updateLegend() {
    if (this.legend) {
      this.legend.remove();
    }
    if (this.mapCache.hasMap(this.mapId)) {

      this.legend = new Control({ position: 'topright' });

      this.legend.onAdd = () => {
        const div = DomUtil.create('div', 'leaflet-bar legend');
        div.innerHTML = this.getLegendContent();
        div.onclick = () => this.toggleLegend(div)
        return div;
      };
      this.legend.addTo(this.mapCache.getMap(this.mapId));
    }
  }

  private toggleLegend(div: HTMLElement) {
    this.legendVisible = !this.legendVisible;
    div.innerHTML = this.getLegendContent();
    const moreLink = DomUtil.get('annual-more-link');
    if (moreLink) {
      moreLink.onclick = (event) => {
        this.iab.create(this.translate.instant('annual-map.legend.link-more-url'), '_system', 'hidden=yes');
        event.stopPropagation();
      };
    }
  }

  private getLegendContent() {
    if (this.legendVisible) {
      const langCode = this.translate.currentLang.toLocaleUpperCase();
      let legendId: string;
      switch (this.phenomenonLabel) {
        case 'BC':
          legendId = 'bc_anmean';
          break;
        case 'NO2':
          legendId = 'no2_anmean';
          break;
        case 'O3':
          legendId = 'o3_anmean';
          break;
        case 'PM10':
          legendId = 'pm10_anmean';
          break;
        case 'PM25':
          legendId = 'pm25_anmean';
          break;
      }
      let legend = '<img src="http://www.irceline.be/air/legend/' + legendId + '_' + langCode + '.svg">';
      return legend += `<div id="annual-more-link">${this.translate.instant('annual-map.legend.link-more')}</div>`;
    }
    return '<a class="info" role="button"></a>';
  }

  private setOverlayMap(phenomenon) {
    this.annualMean.getYear().subscribe(year => {
      this.overlayMaps.clear();
      this.year = year;
      const layerId = this.createLayerId(phenomenon, year);
      this.phenomenonLabel = phenomenon;
      const wmsUrl = `http://geo.irceline.be/rioifdm/${layerId}/wms`;
      const layerOptions: TileLayerOptions = {
        layers: layerId,
        transparent: true,
        format: 'image/png',
        tiled: 'true',
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

  private createLayerId(phenomenon: string, year: string): string {
    switch (phenomenon) {
      case 'NO2': return this.annualMean.getLayerId(year, AnnualPhenomenonMapping.NO2);
      case 'O3': return this.annualMean.getLayerId(year, AnnualPhenomenonMapping.O3);
      case 'PM10': return this.annualMean.getLayerId(year, AnnualPhenomenonMapping.PM10);
      case 'PM25': return this.annualMean.getLayerId(year, AnnualPhenomenonMapping.PM25);
      case 'BC': return this.annualMean.getLayerId(year, AnnualPhenomenonMapping.BC);
    }
  }

}
