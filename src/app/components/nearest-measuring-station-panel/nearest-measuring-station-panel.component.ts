import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { PhenomenonSeriesID } from '../../model/phenomenon';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import {
  NearestMeasuringStationPanelInformationPopupComponent,
} from './nearest-measuring-station-panel-information-popup.component';

interface PanelEntry {
  label: string;
  id: string;
}

@Component({
  selector: 'nearest-measuring-station-panel',
  templateUrl: './nearest-measuring-station-panel.component.html',
  styleUrls: ['./nearest-measuring-station-panel.component.scss'],
})
export class NearestMeasuringStationPanelComponent implements OnChanges {

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  @Input()
  public location: UserLocation;

  public entries: PanelEntry[] = [
    {
      label: 'BC',
      id: PhenomenonSeriesID.BC
    },
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

  public presentPopover(myEvent) {
    this.popoverCtrl.create({
      component: NearestMeasuringStationPanelInformationPopupComponent,
      event: myEvent
    }).then(popover => popover.present());
  }

  public entryReady() {
    this.readyCounter--;
    if (this.readyCounter === 0) {
      this.ready.emit();
    }
  }

}
