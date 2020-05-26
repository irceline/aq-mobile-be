import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {UserLocation} from '../../Interfaces';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-location-sortable',
    templateUrl: './location-sortable.component.html',
    styleUrls: ['./location-sortable.component.scss'],
})
export class LocationSortableComponent implements OnInit {
    @Input() locations: UserLocation[] = [];

    @Output() locationRemoved = new EventEmitter();
    @Output() locationUpdated = new EventEmitter();

    constructor(private alertController: AlertController, private translate: TranslateService) {}

    ngOnInit() {}

    doReorder(ev: any) {
        ev.detail.complete(this.locations);
        this.locationUpdated.emit(this.locations);
    }

    async deleteLocation(location) {
        const alert = await this.alertController.create({
            header: this.translate.instant('v2.components.location-sortable.header'),
            message: this.translate.instant('v2.components.location-sortable.message'),
            buttons: [
                {
                    text: this.translate.instant('v2.components.location-sortable.cancel'),
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        // console.log('cancel');
                    },
                },
                {
                    text: this.translate.instant('v2.components.location-sortable.confirm'),
                    handler: () => {
                        this.locationRemoved.emit(location);
                    },
                },
            ],
        });

        await alert.present();
    }
}
