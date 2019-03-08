import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { PhenomenonSeriesID } from '../../model/phenomenon';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { SubIndexPanelInformationPopupComponent } from './sub-index-panel-information-popup.component';

export interface SubIndexEntry {
  label: string;
  id: string;
  index?: string;
}

@Component({
  selector: 'sub-index-panel',
  templateUrl: './sub-index-panel.component.html',
  styleUrls: ['./sub-index-panel.component.scss'],
})
export class SubIndexPanelComponent implements OnChanges {

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  @Input()
  public location: UserLocation;

  public entries: SubIndexEntry[] = [
    {
      label: 'NO2',
      id: PhenomenonSeriesID.NO2
    },
    {
      label: 'O3',
      id: PhenomenonSeriesID.O3
    },
    {
      label: 'PM10',
      id: PhenomenonSeriesID.PM10
    },
    {
      label: 'PM2.5',
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
      component: SubIndexPanelInformationPopupComponent,
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
