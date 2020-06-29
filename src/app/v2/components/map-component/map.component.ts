import './custom-canvas';

import { HttpClient } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { CacheService } from 'ionic-cache';
import * as L from 'leaflet';

import { MainPhenomenon } from '../../common/phenomenon';
import { UserLocation } from '../../Interfaces';
import { IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';

@Component({
    selector: 'map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent {

    private map;
    private _currentLocation: UserLocation;
    private _phenomenon: MainPhenomenon;

    constructor(
        private ircelineSettings: IrcelineSettingsService,
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
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
        if (this.map && isDefined(this._phenomenon)) {
            this.ircelineSettings.getSettings().subscribe(settings => {
                const request = this.http.get('./assets/multipolygon.json');
                this.cacheService.loadFromObservable('multipolygon', request, null, 60 * 60 * 24)
                    .subscribe((geojson: GeoJSON.GeoJsonObject) => {
                        const layerOptions: L.CustomCanvasOptions = {
                            layers: this.createLayerId(),
                            styles: this.createStyleId(),
                            transparent: true,
                            format: 'image/png',
                            opacity: 0.7,
                            tiled: true,
                            boundary: geojson,
                            useBoundaryGreaterAsZoom: 12,
                            useCache: true,
                            crossOrigin: true,
                        };
                        layerOptions['time'] = settings.lastupdate.toISOString();

                        L.tileLayer.customCanvas('https://geo.irceline.be/rioifdm/wms', layerOptions).addTo(this.map);
                    });
            });
        }
    }

    private createLayerId(): string {
        switch (this._phenomenon) {
            case MainPhenomenon.NO2:
                return 'no2_hmean';
            case MainPhenomenon.O3:
                return 'o3_hmean';
            case MainPhenomenon.PM10:
                return 'pm10_24hmean';
            case MainPhenomenon.PM25:
                return 'pm25_24hmean';
            case MainPhenomenon.BC:
                return 'bc_hmean';
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
            case MainPhenomenon.BC:
                return 'bc_hmean_raster_discrete_belair';
        }
    }
}
