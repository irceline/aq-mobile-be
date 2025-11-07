import {
  Component,
  EventEmitter,
  Input,
  Output,
  NgZone,
  OnInit,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalController, ToastController } from '@ionic/angular';
import L from 'leaflet';

import { BelAQIService } from '../../services/bel-aqi.service';
import { GeocoderService } from '../../services/geocoder/geocoder.service';

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('250ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
    trigger('fadeBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FeedbackLocationComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  // @ts-ignore
  @Input() location: { longitude: number; latitude: number };
  // @ts-ignore
  public backgroundColor: string;
  // @ts-ignore
  public loadingLabel: boolean;
  // @ts-ignore
  private map: L.Map;

  constructor(
    private belAQIService: BelAQIService,
    private modalCtrl: ModalController,
    private geocoder: GeocoderService,
    private zone: NgZone,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.belAQIService.$activeIndex.subscribe(
      (idx) =>
        (this.backgroundColor = this.belAQIService.getLightColorForIndex(
          idx?.indexScore
        ))
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.drawMap(), 200);
  }

  drawMap() {
    if (this.map !== undefined) {
      this.map.remove();
    }
    this.map = L.map('mapEditLocation', {
      center: [this.location.latitude, this.location.longitude],
      zoom: 14,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.addMarker();
  }

  addMarker() {
    if (this.map) {
      const location = {
        lat: this.location.latitude,
        lng: this.location.longitude,
      } as L.LatLngLiteral;
      const icondiv = L.divIcon({
        className: 'marker',
        iconAnchor: L.point(10, 40),
      });
      const marker = L.marker(location, {
        draggable: true,
        icon: icondiv,
      }).addTo(this.map);
      marker.on('dragend', (evt) => {
        this.loadingLabel = true;
        const latLng = evt.target.getLatLng() as L.LatLng;
        this.updatePosition(latLng, marker);
      });
    }
  }

  private updatePosition(latLng: L.LatLng, marker: L.Marker<any>) {
    this.zone.run(() => {
      if (this.geocoder.insideBelgium(latLng.lat, latLng.lng)) {
        this.location.latitude = latLng.lat;
        this.location.longitude = latLng.lng;
      } else {
        marker.setLatLng({
          lat: this.location.latitude,
          lng: this.location.longitude,
        });
        this.toastController
          .create({
            message: 'Selected location is outside of Belgium',
            duration: 2000,
          })
          .then((toast) => toast.present());
        FeedbackLocationComponent;
      }
      this.loadingLabel = false;
    });
  }

  confirm() {
    this.modalCtrl.dismiss({
      latitude: this.location.latitude,
      longitude: this.location.longitude,
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  close() {
    this.closed.emit();
  }
}
