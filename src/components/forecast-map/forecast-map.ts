import { Component, AfterViewInit } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'forecast-map',
  templateUrl: 'forecast-map.html'
})
export class ForecastMapComponent implements AfterViewInit {

  private map: L.Map;

  constructor() { }

  ngAfterViewInit(): void {
    this.createMap();
  }

  private createMap() {
    this.map = L.map('forecast-map', {}).setView([50.5, 4.5], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.tileLayer.wms("http://geo.irceline.be/forecast/wms", {
		layers: 'o3_maxhmean',
    transparent: true,
    format: 'image/png',
    time: '2018-05-08',
    opacity: 0.7
    }).addTo(this.map);
  }
}
