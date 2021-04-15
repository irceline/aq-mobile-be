import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-info-button',
    templateUrl: './info-button.component.html',
    styleUrls: ['./info-button.component.scss', './info-button.component.hc.scss'],
})
export class InfoButtonComponent implements OnInit {
    constructor(private navCtrl: NavController) {}

    ngOnInit() {}

    goTo() {
        this.navCtrl.navigateForward(['/main/app-info']);
    }
}
