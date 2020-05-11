import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-location-sortable',
    templateUrl: './location-sortable.component.html',
    styleUrls: ['./location-sortable.component.scss'],
})
export class LocationSortableComponent implements OnInit {
    @Input() locations = [];

    @Output() locationRemoved = new EventEmitter();
    @Output() locationUpdated = new EventEmitter();

    constructor(private alertController: AlertController) {}

    ngOnInit() {}

    doReorder(ev: any) {
        console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
        this.locationUpdated.emit(ev.detail);
        ev.detail.complete();
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
                        console.log('cancel');
                    },
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.locationRemoved.emit(location);
                    },
                },
            ],
        });

        await alert.present();
    }
}
