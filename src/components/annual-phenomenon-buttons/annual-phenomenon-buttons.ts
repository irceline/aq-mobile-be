import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AnnualMeanProvider, AnnualPhenomenonMapping } from '../../providers/annual-mean/annual-mean';
import { ModalAnnualMapComponent } from '../modal-annual-map/modal-annual-map';

@Component({
  selector: 'annual-phenomenon-buttons',
  templateUrl: 'annual-phenomenon-buttons.html'
})
export class AnnualPhenomenonButtonsComponent implements OnInit {

  @Input()
  public location: GeoJSON.Point;

  public colorNO2: string;
  public colorO3: string;
  public colorBC: string;
  public colorPM10: string;
  public colorPM25: string;

  constructor(
    private modalCtrl: ModalController,
    private annualMeanProvider: AnnualMeanProvider
  ) { }

  public ngOnInit(): void {
    if (this.location) {
      this.annualMeanProvider.getYear().subscribe(year => {
        const lat = this.location.coordinates[1];
        const lon = this.location.coordinates[0];
        this.setColor(lat, lon, year, AnnualPhenomenonMapping.NO2).subscribe(c => this.colorNO2 = c);
        this.setColor(lat, lon, year, AnnualPhenomenonMapping.BC).subscribe(c => this.colorBC = c);
        this.setColor(lat, lon, year, AnnualPhenomenonMapping.O3).subscribe(c => this.colorO3 = c);
        this.setColor(lat, lon, year, AnnualPhenomenonMapping.PM10).subscribe(c => this.colorPM10 = c);
        this.setColor(lat, lon, year, AnnualPhenomenonMapping.PM25).subscribe(c => this.colorPM25 = c);
      });
    }
  }

  private setColor(lat: number, lon: number, year: string, phenomenon: AnnualPhenomenonMapping): Observable<string> {
    return this.annualMeanProvider.getValue(lat, lon, year, phenomenon)
      .pipe(map(value => {
        return this.annualMeanProvider.getCategorizeColor(phenomenon, value);
      }));
  }

  public openMap(phenomenon: string) {
    this.modalCtrl.create(ModalAnnualMapComponent, { phenomenon, location: this.location }).present();
  }

}
