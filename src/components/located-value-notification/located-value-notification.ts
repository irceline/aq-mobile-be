import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import L from 'leaflet';
import { LocatedValueNotification } from '../../providers/notification-presenter/notification-presenter';

@Component({
  selector: 'located-value-notification',
  templateUrl: 'located-value-notification.html'
})
export class LocatedValueNotificationComponent {

  public notification: LocatedValueNotification
  public location: GeoJSON.Point;
  public mapOptions: L.MapOptions = {
    maxZoom: 14,
    zoomControl: false
  }

  constructor(
    private viewCtrl: ViewController,
    private params: NavParams
  ) {
    this.notification = this.params.get('notification');
    this.location = {
      type: 'Point',
      coordinates: [this.notification.longitude, this.notification.latitude]
    }
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }
}
