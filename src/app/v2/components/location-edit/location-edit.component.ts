import { AfterViewInit, Component, Input, NgZone, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
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
  public editedUserLocation: UserLocation;

  public backgroundColor: string;

  public loadingLabel: boolean;

  private map: L.Map;

  constructor(
    private belAQIService: BelAQIService,
    private modalCtrl: ModalController,
    private geocoder: GeocoderService,
    private zone: NgZone,
    private translateSrvc: TranslateService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.belAQIService.$activeIndex.subscribe(idx => this.backgroundColor = this.belAQIService.getLightColorForIndex(idx?.indexScore));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.drawMap(), 200);
  }

  drawMap() {
    if (this.map !== undefined) {
      this.map.remove();
    }
    this.editedUserLocation = Object.assign({}, this.userLocation);
    this.map = L.map('mapEditLocation', {
      center: [this.editedUserLocation.latitude, this.editedUserLocation.longitude],
      zoom: 14
    });
    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.addMarker();
  }

  addMarker() {
    if (this.map) {
      const location = { lat: this.editedUserLocation.latitude, lng: this.editedUserLocation.longitude } as L.LatLngLiteral;
      const icondiv = L.divIcon({ className: 'marker', iconAnchor: L.point(10, 40) });
      const marker = L.marker(location, { draggable: true, icon: icondiv }).addTo(this.map);
      marker.on('dragend', (evt => {
        this.loadingLabel = true;
        // nominatim request mit loading-hint and save new location
        const latLng = evt.target.getLatLng() as L.LatLng;
        if (!this.editedUserLocation.wasEdited) {
          this.geocoder.reverse(latLng.lat, latLng.lng, { acceptLanguage: this.translateSrvc.currentLang }).subscribe(
            res => {
              this.updatePosition(latLng, marker, res.label);
            }, err => {
              marker.setLatLng({ lat: this.editedUserLocation.latitude, lng: this.editedUserLocation.longitude });
              this.toastController.create({ message: 'Error while geocoding new location', duration: 2000 }).then(toast => toast.present());
              this.loadingLabel = false;
            }
          );
        } else {
          this.updatePosition(latLng, marker);
        }
      }));
    }
  }

  private updatePosition(latLng: L.LatLng, marker: L.Marker<any>, label?: string) {
    this.zone.run(() => {
      if (this.geocoder.insideBelgium(latLng.lat, latLng.lng)) {
        this.editedUserLocation.latitude = latLng.lat;
        this.editedUserLocation.longitude = latLng.lng;
        if (label) { this.editedUserLocation.label = label; }
      } else {
        marker.setLatLng({ lat: this.editedUserLocation.latitude, lng: this.editedUserLocation.longitude });
        this.toastController.create({ message: 'Selected location is outside of Belgium', duration: 2000 })
          .then(toast => toast.present());
      }
      this.loadingLabel = false;
    });
  }

  async editLabel() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.translateSrvc.instant('edit-location-label.title'),
      inputs: [
        {
          name: 'label',
          type: 'text',
          value: this.editedUserLocation.label
        }
      ],
      buttons: [
        {
          text: this.translateSrvc.instant('controls.cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.translateSrvc.instant('controls.ok'),
          handler: (data: { label: string }) => {
            console.log('Confirm Ok');
            this.editedUserLocation.label = data.label;
            this.editedUserLocation.wasEdited = true;
          }
        }
      ]
    });

    await alert.present();
  }

  confirm() {
    this.modalCtrl.dismiss(this.editedUserLocation);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}
