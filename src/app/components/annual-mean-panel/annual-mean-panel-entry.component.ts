import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import invert from 'invert-color';
import { map } from 'rxjs/operators';

import { AnnualMeanService } from '../../services/annual-mean/annual-mean.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { AnnualMeanEntry } from './annual-mean-panel.component';

@Component({
  selector: 'annual-mean-panel-entry',
  templateUrl: './annual-mean-panel-entry.component.html',
  styleUrls: ['./annual-mean-panel-entry.component.scss'],
})
export class AnnualMeanPanelEntryComponent implements AfterViewInit {

  public color: string;
  public backgroundColor: string;

  public loading = true;

  @Input()
  public entry: AnnualMeanEntry;

  @Input()
  public location: UserLocation;

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  constructor(
    private annualMeanProvider: AnnualMeanService
  ) { }

  public ngAfterViewInit(): void {
    this.annualMeanProvider.getYear().subscribe(year => {
      this.annualMeanProvider.getValue(this.location.latitude, this.location.longitude, year, this.entry.phenomenon)
        .pipe(map(value => this.annualMeanProvider.getCategorizeColor(this.entry.phenomenon, value)))
        .subscribe(
          res => {
            this.backgroundColor = res;
            this.color = invert(this.backgroundColor, true);
            this.loading = false;
          },
          error => {
            this.loading = false;
          }
        );
    });
  }

  public select() {
    this.selected.emit(this.entry.id);
  }

}
