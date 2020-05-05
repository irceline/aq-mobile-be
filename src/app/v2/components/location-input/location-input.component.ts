import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss'],
})
export class LocationInputComponent implements OnInit {
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
            })
            .catch((error) => {
                console.log('Error getting location', error);
            });
    }
}
