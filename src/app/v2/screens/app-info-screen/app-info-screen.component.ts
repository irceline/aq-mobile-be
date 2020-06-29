import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { MainPhenomenon } from '../../common/phenomenon';
import { lightIndexColor } from '../../common/constants';
import { ModelledValueService } from '../../services/value-provider/modelled-value.service';
import { UserSettingsService } from './../../services/user-settings.service';

interface ValColorPair {
    value: number;
    color: string;
}

@Component({
    selector: 'app-app-info-screen',
    templateUrl: './app-info-screen.component.html',
    styleUrls: ['./app-info-screen.component.scss'],
})
export class AppInfoScreenComponent implements OnInit {

    public o3: ValColorPair;
    public no2: ValColorPair;
    public pm10: ValColorPair;
    public pm25: ValColorPair;

    constructor(
        private navCtrl: NavController,
        private userSettingsSrvc: UserSettingsService,
        private modelledValueSrvc: ModelledValueService
    ) { }

    ngOnInit() {
        const location = this.userSettingsSrvc.selectedUserLocation;
        this.modelledValueSrvc.getCurrentValue(location, MainPhenomenon.O3).subscribe(
            res => this.o3 = {
                value: Math.round(res.value),
                color: lightIndexColor[res.index]
            }
        );

        this.modelledValueSrvc.getCurrentValue(location, MainPhenomenon.NO2).subscribe(
            res => this.no2 = {
                value: Math.round(res.value),
                color: lightIndexColor[res.index]
            }
        );

        this.modelledValueSrvc.getCurrentValue(location, MainPhenomenon.PM10).subscribe(
            res => this.pm10 = {
                value: Math.round(res.value),
                color: lightIndexColor[res.index]
            }
        );

        this.modelledValueSrvc.getCurrentValue(location, MainPhenomenon.PM25).subscribe(
            res => this.pm25 = {
                value: Math.round(res.value),
                color: lightIndexColor[res.index]
            }
        );
    }

    goBack() {
        this.navCtrl.navigateBack(['/main']);
    }
}
