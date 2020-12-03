import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';

import { BelAQIService } from '../../services/bel-aqi.service';
import { UserLocation } from './../../Interfaces/index';
import { GeocoderService } from './../../services/geocoder/geocoder.service';

@Component({
  selector: 'app-location-edit',
  templateUrl: './location-edit.component.html',
  styleUrls: ['./location-edit.component.scss'],
})
export class LocationEditComponent implements OnInit, AfterViewInit {

  @Input() userLocation: UserLocation;
  public backgroundColor: string;

  public loadingLabel: boolean;

  private map: L.Map;

  constructor(
    private belAQIService: BelAQIService,
    private modalCtrl: ModalController,
    private geocoder: GeocoderService,
    private translateSrvc: TranslateService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.belAQIService.$activeIndex.subscribe(idx => this.backgroundColor = this.belAQIService.getLightColorForIndex(idx.indexScore));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.drawMap(), 200);
  }

  drawMap() {
    if (this.map !== undefined) {
      this.map.remove();
    }
    this.map = L.map('mapEditLocation', {
      center: [this.userLocation.latitude, this.userLocation.longitude],
      zoom: 12
    });
    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.addMarker();
  }

  addMarker() {
    if (this.map) {
      const location = { lat: this.userLocation.latitude, lng: this.userLocation.longitude } as L.LatLngLiteral;
      const icondiv = L.divIcon({ className: 'marker', iconAnchor: L.point(10, 40) });
      const marker = L.marker(location, { draggable: true, icon: icondiv }).addTo(this.map);
      marker.on('dragend', (evt => {
        this.loadingLabel = true;
        // nominatim request mit loading-hint and save new location
        const latLng = evt.target.getLatLng() as L.LatLng;
        this.geocoder.reverse(latLng.lat, latLng.lng, { acceptLanguage: this.translateSrvc.currentLang }).subscribe(
          res => {
            if (this.geocoder.insideBelgium(latLng.lat, latLng.lng)) {
              this.userLocation.latitude = latLng.lat;
              this.userLocation.longitude = latLng.lng;
              this.userLocation.label = res.label;
            } else {
              marker.setLatLng({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });
              this.toastController.create({ message: 'Selected location is outside of belgium', duration: 2000 })
                .then(toast => toast.present());
            }
            this.loadingLabel = false;
          }, err => {
            marker.setLatLng({ lat: this.userLocation.latitude, lng: this.userLocation.longitude });
            this.toastController.create({ message: 'Error while geocoding new location', duration: 2000 }).then(toast => toast.present());
            this.loadingLabel = false;
          }
        );
      }));
    }
  }

  confirm() {
    this.modalCtrl.dismiss(this.userLocation);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}
