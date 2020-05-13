import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-app-info-screen',
    templateUrl: './app-info-screen.component.html',
    styleUrls: ['./app-info-screen.component.scss'],
})
export class AppInfoScreenComponent implements OnInit {
    constructor(private navCtrl: NavController) {}

    ngOnInit() {}

    goBack() {
        this.navCtrl.navigateBack(['/main'], { animated: false });
    }
}
