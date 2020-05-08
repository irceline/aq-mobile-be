import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { IonReorderGroup, AlertController } from '@ionic/angular';
import {
    UserNotificationSetting,
    NotificationType,
} from '../user-notification-settings/user-notification-settings.component';
import { UserLocation } from '../../Interfaces';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('menuAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('100ms', style({ opacity: 1 })),
            ]),
            transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
        ]),
    ],
})
export class HeaderComponent implements OnInit {
    @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

    visible = false;
    language = 'e';
    userSettings: UserNotificationSetting[] = [
        {
            notificationType: NotificationType.highConcentration,
            enabled: true,
        },
        {
            notificationType: NotificationType.transport,
            enabled: true,
        },
        {
            notificationType: NotificationType.activity,
            enabled: false,
        },
        {
            notificationType: NotificationType.allergies,
            enabled: true,
        },
        {
            notificationType: NotificationType.exercise,
            enabled: false,
        },
    ];

    locationList: any[] = [
        { name: 'Koksijde', id: 'abc', order: 1 },
        { name: 'Herent', id: 'def', order: 2 },
    ];

    constructor(private alertController: AlertController) {}

    ngOnInit() {}

    openMenu() {
        this.visible = !this.visible;
    }

    doReorder(ev: any) {
        console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
        ev.detail.complete();
    }

    async deleteLocation() {
        const alert = await this.alertController.create({
            header: 'Delete location!',
            message: 'Are you sure to delete this location?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    },
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        console.log('Confirm Okay');
                    },
                },
            ],
        });

        await alert.present();
    }
}
