import './custom-canvas';

import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { CacheService } from 'ionic-cache';
import * as L from 'leaflet';

import boundary from '../../../../assets/multipolygon.json';
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

    private map: L.Map;
    private _currentLocation: UserLocation;
    private _phenomenon: MainPhenomenon;
    private _valueDate: ValueDate;
    private _phenomenonLayer: L.TileLayer.CustomCanvas;

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
    set phenomenon(phen: MainPhenomenon) {
        this._phenomenon = phen;
        this.addPhenomenonLayer();
    }

    @Input()
    set valueDate(valueDate: ValueDate) {
        this._valueDate = valueDate;
        this.addPhenomenonLayer();
    }

    drawMap(): void {
        if (this.map !== undefined) {
            this.map.remove();
        }
        this.map = L.map('mapElement', {
            center: [this._currentLocation.latitude, this._currentLocation.longitude],
            zoom: 12
        });
        const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png', {
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
        if (this.map && isDefined(this._phenomenon) && isDefined(this._valueDate)) {
            this.modelledValueSrvc.getTimeParam(this._phenomenon, this._valueDate).subscribe(time => {
                let layerOptions: L.CustomCanvasOptions;
                let wmsurl: string;
                if (this._phenomenon === MainPhenomenon.BELAQI) {
                    layerOptions = this.belaqiIndexSrvc.getLayerOptions(this._valueDate);
                    layerOptions.opacity = 0.7;
                    layerOptions.styles = this.createStyleId();
                    layerOptions.tiled = true;
                    layerOptions.boundary = boundary as GeoJSON.GeoJsonObject;
                    layerOptions.useBoundaryGreaterAsZoom = 12;
                    layerOptions.useCache = true;
                    layerOptions.crossOrigin = true;
                    wmsurl = this.belaqiIndexSrvc.getWmsUrl(this._valueDate);
                } else {
                    layerOptions = {
                        layers: this.modelledValueSrvc.getLayersId(this._phenomenon, this._valueDate),
                        styles: this.createStyleId(),
                        transparent: true,
                        format: 'image/png',
                        opacity: 0.7,
                        tiled: true,
                        boundary: boundary as GeoJSON.GeoJsonObject,
                        useBoundaryGreaterAsZoom: 12,
                        useCache: true,
                        crossOrigin: true,
                    };
                    wmsurl = this.modelledValueSrvc.getWmsUrl(this._phenomenon, this._valueDate);
                }

                if (time && !layerOptions.time) {
                    layerOptions.time = time;
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
}
