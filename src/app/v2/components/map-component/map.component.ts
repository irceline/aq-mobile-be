import './custom-canvas';

import { HttpClient } from '@angular/common/http';
// import { isDefined } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { CacheService } from 'ionic-cache';
import * as L from 'leaflet';

// import boundary from '../../../../assets/multipolygon.json';
import boundary from '../../../../assets/belgium.json';
import { ValueDate } from '../../common/enums';
import { MainPhenomenon } from '../../common/phenomenon';
import { UserLocation } from '../../Interfaces';
import { IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';
import { BelaqiIndexService } from '../../services/value-provider/belaqi-index.service';
import { ModelledValueService } from '../../services/value-provider/modelled-value.service';

@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  private map!: L.Map;
  private _center!: Partial<UserLocation>;
  private _currentLocation!: UserLocation;
  private _phenomenon!: MainPhenomenon;
  private _valueDate!: ValueDate;
  private _phenomenonLayer!: L.TileLayer.CustomCanvas;

  constructor(
    private ircelineSettings: IrcelineSettingsService,
    private modelledValueSrvc: ModelledValueService,
    private belaqiIndexSrvc: BelaqiIndexService,
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  @Input()
  set currentLocation(loc: UserLocation) {
    this._currentLocation = loc;
    this.drawMap();
  }

  @Input()
  set center(loc: Partial<UserLocation>) {
    this._center = loc;
  }

  @Input()
  set phenomenon(phen: MainPhenomenon | undefined) {
    if (phen || phen === 0) {
      this._phenomenon = phen;
      this.addPhenomenonLayer();
    }
  }

  @Input()
  set valueDate(valueDate: ValueDate | undefined) {
    if (valueDate !== undefined && valueDate > -1) {
      this._valueDate = valueDate;
      this.addPhenomenonLayer();
    }
  }

  drawMap(): void {
    if (this.map !== undefined) {
      this.map.remove();
    }
    this.map = L.map('mapElement', {
      // @ts-ignore
      center: [this._center.latitude, this._center.longitude],
      zoom: 7
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.addMarker();

    this.addPhenomenonLayer();
  }

  private addMarker() {
    if (this.map) {
      const location = { lat: this._currentLocation.latitude, lng: this._currentLocation.longitude } as L.LatLngLiteral;
      const icondiv = L.divIcon({ className: 'marker', iconAnchor: L.point(10, 40) });
      L.marker(location, { draggable: false, icon: icondiv }).addTo(this.map);
    }
  }

  private addPhenomenonLayer() {
    if (this.map && typeof this._phenomenon != 'undefined' && typeof this._valueDate != 'undefined') {
      this.modelledValueSrvc.getTimeParam(this._phenomenon, this._valueDate).subscribe(time => {
        let layerOptions: L.CustomCanvasOptions;
        let wmsurl: string;
        if (this._phenomenon === MainPhenomenon.BELAQI) {
          layerOptions = this.belaqiIndexSrvc.getLayerOptions(this._valueDate);
          layerOptions.opacity = 0.7;
          //layerOptions.styles = this.createStyleId(); //styles via geobelair server, easier to change when necessary
          layerOptions.tiled = true;
          layerOptions.boundary = boundary as GeoJSON.GeoJsonObject;
          layerOptions.useBoundaryGreaterAsZoom = 12;
          layerOptions.useCache = false; //never use cache
          layerOptions.crossOrigin = true;
          wmsurl = this.belaqiIndexSrvc.getWmsUrl(this._valueDate);
        } else {
          layerOptions = {
            layers: this.modelledValueSrvc.getLayersId(this._phenomenon, this._valueDate),
            //styles: this.createStyleId_pf(), //styles via geobelair server, easier to change when necessary
            transparent: true,
            format: 'image/png',
            opacity: 0.7,
            tiled: true,
            boundary: boundary as GeoJSON.GeoJsonObject,
            useBoundaryGreaterAsZoom: 12,
            useCache: false, //never use cache
            crossOrigin: true,
          };
          wmsurl = this.modelledValueSrvc.getWmsUrl(this._phenomenon, this._valueDate);
        }

        if (time && !layerOptions.time) {
          //layerOptions.time = time; //time not necessary, only one geotiff available via server scripts
          layerOptions.time = "";
        }

        if (this._phenomenonLayer) {
          this._phenomenonLayer.remove();
        }
        this._phenomenonLayer = L.tileLayer.customCanvas(
          wmsurl,
          layerOptions
        ).addTo(this.map);
      });
    }
  }

  //styles via geobelair server, easier to change when necessary
  /*
      private createStyleId(): string {
          switch (this._phenomenon) {
              case MainPhenomenon.NO2:
                  return 'no2_hmean_raster_discrete_belair';
              case MainPhenomenon.O3:
                  return 'o3_hmean_raster_discrete_belair';
              case MainPhenomenon.PM10:
                  return 'pm10_hmean_raster_discrete_belair';
              case MainPhenomenon.PM25:
                  return 'pm25_hmean_raster_discrete_belair';
              case MainPhenomenon.BELAQI:
                  return 'belaqi_raster_discrete_belair';
              case MainPhenomenon.BC:
                  return 'bc_hmean_raster_discrete_belair';
          }
      }

      private createStyleId_pf(): string {
          switch (this._phenomenon) {
              case MainPhenomenon.NO2:
                  return 'no2_dmean_raster_discrete_belair';
              case MainPhenomenon.O3:
                  return 'o3_max8hmean_raster_discrete_belair';
              case MainPhenomenon.PM10:
                  return 'pm10_dmean_raster_discrete_belair';
              case MainPhenomenon.PM25:
                  return 'pm25_dmean_raster_discrete_belair';
              case MainPhenomenon.BELAQI:
                  return 'belaqi_raster_discrete_belair';
              case MainPhenomenon.BC:
                  return 'bc_dmean_raster_discrete_belair';
          }
      }*/

}
