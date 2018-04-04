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
    this.map = L.map('forecast-map', {}).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    var marker = L.marker([51.5, -0.09]).addTo(this.map);

    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    var polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(this.map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

  }

}
