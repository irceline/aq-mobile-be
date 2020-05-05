import { Component, OnInit, ViewChild } from '@angular/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { IonReorderGroup } from '@ionic/angular';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('myInsertRemoveTrigger', [
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

    state = false;
    language = 'e';

    constructor() {}

    ngOnInit() {}

    openMenu() {
        this.state = !this.state;
    }

    doReorder(ev: any) {
        console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
        ev.detail.complete();
    }
}
