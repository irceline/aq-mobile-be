import { AfterViewInit, Component } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-feedback-stats-map',
  templateUrl: './feedback-stats-map.component.html',
  styleUrls: ['./feedback-stats-map.component.scss']
})
export class FeedbackStatsMapComponent implements AfterViewInit {

  public fitBounds: L.LatLngBoundsExpression = [[49.5294835476, 2.51357303225], [51.4750237087, 6.15665815596]];
  public map: L.Map;
  public currentLayer: L.TileLayer.CustomCanvas;

  ngAfterViewInit(): void {
    this.map = L.map('feedbackMap', {
      zoom: 12
    });
    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    setTimeout(() => {
      this.map.fitBounds(this.fitBounds);
      this.showDayLayer();
      this.map.invalidateSize();
    }, 200);
  }

  public toggleMapLayer(evt: CustomEvent) {
    if (evt.detail.value === 'day') {
      this.showDayLayer();
    } else {
      this.showTotalLayer();
    }
  }

  private showDayLayer() {
    if (this.currentLayer) { this.currentLayer.remove(); }
    this.currentLayer = L.tileLayer.customCanvas(
      'https://geo.irceline.be/belair/wms',
      {
        layers: 'feedback_day',
        format: 'image/png',
        useCache: true,
        transparent: true,
        crossOrigin: true
      }
    ).addTo(this.map);
  }

  private showTotalLayer() {
    if (this.currentLayer) { this.currentLayer.remove(); }
    this.currentLayer = L.tileLayer.customCanvas(
      'https://geo.irceline.be/belair/wms',
      {
        layers: 'feedback_total',
        format: 'image/png',
        useCache: true,
        transparent: true,
        crossOrigin: true
      }
    ).addTo(this.map);
  }

}
