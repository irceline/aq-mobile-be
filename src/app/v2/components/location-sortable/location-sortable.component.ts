import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {UserLocation} from '../../Interfaces';

@Component({
    selector: 'app-location-sortable',
    templateUrl: './location-sortable.component.html',
    styleUrls: ['./location-sortable.component.scss'],
})
export class LocationSortableComponent implements OnInit {
    @Input() locations: UserLocation[] = [];

    @Output() locationRemoved = new EventEmitter();
    @Output() locationUpdated = new EventEmitter();

    constructor(private alertController: AlertController) {}

    ngOnInit() {}

    doReorder(ev: any) {
        ev.detail.complete(this.locations);
        this.locationUpdated.emit(this.locations);
    }

    async deleteLocation(location) {
        const alert = await this.alertController.create({
            header: 'Delete location!',
            message: 'Are you sure to delete this location?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        // console.log('cancel');
                    },
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        this.locationRemoved.emit(location);
                    },
                },
            ],
        });

        await alert.present();
    }
}
