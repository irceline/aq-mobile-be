import { Component, Input } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

import { MainPhenomenon } from '../../common/phenomenon';

marker('v2.screens.main-screen.what-is-no2');
marker('v2.screens.main-screen.about-no2');
marker('v2.screens.main-screen.what-is-belaqi');
marker('v2.screens.main-screen.about-belaqi');
marker('v2.screens.main-screen.what-is-o3');
marker('v2.screens.main-screen.about-o3');
marker('v2.screens.main-screen.what-is-pm10');
marker('v2.screens.main-screen.about-pm10');
marker('v2.screens.main-screen.what-is-pm25');
marker('v2.screens.main-screen.about-pm25');

@Component({
  selector: 'app-parameter-information',
  templateUrl: './parameter-information.component.html',
  styleUrls: ['./parameter-information.component.scss'],
})
export class ParameterInformationComponent {

  expandHint: boolean;

  @Input() parameter: MainPhenomenon;

  parameterHints = [
    {
      parameter: MainPhenomenon.NO2,
      title: 'v2.screens.main-screen.what-is-no2',
      about: 'v2.screens.main-screen.about-no2'
    },
    {
      parameter: MainPhenomenon.BELAQI,
      title: 'v2.screens.main-screen.what-is-belaqi',
      about: 'v2.screens.main-screen.about-belaqi'
    },
    {
      parameter: MainPhenomenon.O3,
      title: 'v2.screens.main-screen.what-is-o3',
      about: 'v2.screens.main-screen.about-o3'
    },
    {
      parameter: MainPhenomenon.PM10,
      title: 'v2.screens.main-screen.what-is-pm10',
      about: 'v2.screens.main-screen.about-pm10'
    },
    {
      parameter: MainPhenomenon.PM25,
      title: 'v2.screens.main-screen.what-is-pm25',
      about: 'v2.screens.main-screen.about-pm25'
    }
  ];

  constructor(
    private translateSrvc: TranslateService
  ) { }


  public get title(): string {
    return this.parameterHints.find(e => e.parameter === this.parameter).title;
  }


  public get about(): string {
    return this.parameterHints.find(e => e.parameter === this.parameter).about;
  }


}
