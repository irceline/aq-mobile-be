import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { PhenomenonSeriesID } from '../../model/phenomenon';
import { AnnualPhenomenonMapping } from '../../services/annual-mean/annual-mean.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { AnnualMeanPanelInformationPopupComponent } from './annual-mean-panel-information-popup.component';

export interface AnnualMeanEntry {
  label: string;
  subscript: string;
  phenomenon: AnnualPhenomenonMapping;
  id: string;
}

@Component({
  selector: 'annual-mean-panel',
  templateUrl: './annual-mean-panel.component.html',
  styleUrls: ['./annual-mean-panel.component.scss'],
})
export class AnnualMeanPanelComponent implements OnChanges {

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  @Input()
  public location: UserLocation;

  public entries: AnnualMeanEntry[] = [
    {
      label: 'NO',
      subscript: '2',
      phenomenon: AnnualPhenomenonMapping.NO2,
      id: PhenomenonSeriesID.NO2
    },
    {
      label: 'PM',
      subscript: '10',
      phenomenon: AnnualPhenomenonMapping.PM10,
      id: PhenomenonSeriesID.PM10
    },
    {
      label: 'PM',
      subscript: '2.5',
      phenomenon: AnnualPhenomenonMapping.PM25,
      id: PhenomenonSeriesID.PM25
    }
  ];

  private readyCounter: number;

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.location) {
      this.readyCounter = this.entries.length;
    }
  }

  public select(id: string) {
    this.selected.emit(id);
  }

  public async presentPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: AnnualMeanPanelInformationPopupComponent,
      event: myEvent
    });
    popover.present();
  }

  public entryReady() {
    this.readyCounter--;
    if (this.readyCounter === 0) {
      this.ready.emit();
    }
  }

}
