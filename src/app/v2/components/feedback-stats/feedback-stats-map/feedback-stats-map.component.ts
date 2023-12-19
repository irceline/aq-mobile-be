import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Observable } from 'rxjs';

import { BelAQIService } from '../../../services/bel-aqi.service';

var inlineIcon = L.icon({
  iconUrl: 'assets/images/icons/inline.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

var notInlineIcon = L.icon({
  iconUrl: 'assets/images/icons/not_inline.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

var woodburnIcon = L.icon({
  iconUrl: 'assets/images/icons/woodburn.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

var trafficIcon = L.icon({
  iconUrl: 'assets/images/icons/traffic.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

var agricultureIcon = L.icon({
  iconUrl: 'assets/images/icons/agriculture.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

var industryIcon = L.icon({
  iconUrl: 'assets/images/icons/industry.svg',
  iconAnchor: [20, 20],
  iconSize: [40, 40]
})

@Component({
  selector: 'app-feedback-stats-map',
  templateUrl: './feedback-stats-map.component.html',
  styleUrls: ['./feedback-stats-map.component.scss', './feedback-stats-map.component.hc.scss']
})
export class FeedbackStatsMapComponent implements AfterViewInit, OnInit {
  // @ts-ignore
  @Input() location: L.LatLng;

  private fitBounds: L.LatLngBoundsExpression = [[49.5294835476, 2.51357303225], [51.4750237087, 6.15665815596]];
  // @ts-ignore
  private map: L.Map;
  // @ts-ignore
  private markers: L.MarkerClusterGroup;
  // @ts-ignore
  public loading: boolean;
  // @ts-ignore
  public backgroundColor: string;

  constructor(
    private http: HttpClient,
    private belAQIService: BelAQIService,
  ) { }

  ngOnInit(): void {
    this.belAQIService.$activeIndex.subscribe(idx => {
      if (idx && idx.indexScore) {
        this.backgroundColor = this.belAQIService.getLightColorForIndex(idx.indexScore)
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('feedbackMap', {
      zoom: 12
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    setTimeout(() => {
      if (this.location) {
        this.map.setView(this.location, 12);
      } else {
        this.map.fitBounds(this.fitBounds);
      }
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
    this.loadLayer('belair:feedback_day');
  }

  private showTotalLayer() {
    this.loadLayer('belair:feedback_total');
  }

  private loadLayer(name: string) {
    if (this.markers) { this.markers.remove(); }
    this.loading = true;
    this.getFeatures(name).subscribe(
      res => {
        this.markers = L.markerClusterGroup();
        const geojsonLayer = L.geoJSON(res, {
          // @ts-ignore
          pointToLayer: function (feature, latlng) {
            switch (feature.properties.feedback_code) {
              case 0: return L.marker(latlng, { icon: inlineIcon })
              case 1: return L.marker(latlng, { icon: notInlineIcon })
              case 2: return L.marker(latlng, { icon: woodburnIcon })
              case 3: return L.marker(latlng, { icon: trafficIcon })
              case 4: return L.marker(latlng, { icon: agricultureIcon })
              case 5: return L.marker(latlng, { icon: industryIcon })
            }
          }
        })
        this.markers.addLayer(geojsonLayer);
        this.map.addLayer(this.markers);
        this.loading = false;
      },
      error => {
        this.loading = false;
      })
  }

  private getFeatures(name: string): Observable<GeoJSON.GeoJsonObject> {
    // const bbox = this.map.getBounds().toBBoxString();
    const url = 'https://geobelair.irceline.be/belair/ows?'
    return this.http.get<GeoJSON.GeoJsonObject>(url, {
      params: {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: name,
        // bbox: bbox,
        outputFormat: 'application/json'
      }
    })
  }
}
