import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import {UserNotificationSetting} from '../user-notification-settings/user-notification-settings.component';
import { UserLocation } from '../../Interfaces';

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss'],
})
export class LocationInputComponent implements OnInit {

    // todo: Discuss with client -> is there a list of location that the user can search in,
    // is this provided by a service, we will just provide dummy data for now
    private _locations: UserLocation[] = [
        {
            id: 1,
            label: 'Antwerpen',
            type: 'user'
        },
        {
            id: 2,
            label: 'Brussels',
            type: 'user'
        },
        {
            id: 3,
            label: 'Chimay',
            type: 'user'
        }
    ]

    // todo : location interface
    @Output() locationSelected = new EventEmitter<UserLocation>();

    constructor(
        private geolocation: Geolocation,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {}

    // Getting the current location with native ionic plugin
    async getCurrentLocation() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.geolocation
            .getCurrentPosition()
            .then(async (resp) => {
                loading.dismiss(null, 'cancel');
                console.log(resp.coords);
                // todo --> reverse geocoding to region / label?
                this.locationSelected.emit( {
                    id: 1,
                    label: 'Gent',
                    type: 'current',
                    latitude: resp.coords.latitude,
                    longitude: resp.coords.longitude
                });
            })
            .catch((error) => {
                loading.dismiss(null, 'cancel');
                console.log('Error getting location', error);
            });
    }
}
