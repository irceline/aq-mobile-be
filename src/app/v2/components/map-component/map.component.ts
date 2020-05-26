import {Component, Input} from '@angular/core';
import * as L from 'leaflet';
import {UserLocation} from '../../Interfaces';

@Component({
    selector: 'map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent {
    private map;
    private _currentLocation: UserLocation;

    constructor() { }

    @Input()
    set currentLocation(loc: UserLocation) {
        this._currentLocation = loc;
        this.drawMap();
    }

    drawMap(): void {
        if (this.map !== undefined) {
            this.map.remove();
        }
        this.map = L.map('mapElement', {
            center: [ this._currentLocation.latitude, this._currentLocation.longitude ],
            zoom: 14
        });
        const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);
    }
}
