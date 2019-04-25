import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { PhenomenonSeriesID } from '../../model/phenomenon';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import {
  NearestMeasuringStationPanelInformationPopupComponent,
} from './nearest-measuring-station-panel-information-popup.component';

export interface NearestMeasuringStationPanelEntry {
  label: string;
  subscript: string;
  phenomenonId: string;
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

  public entries: NearestMeasuringStationPanelEntry[] = [
    {
      label: 'BC',
      subscript: '',
      phenomenonId: PhenomenonSeriesID.BC
    },
    {
      label: 'NO',
      subscript: '2',
      phenomenonId: PhenomenonSeriesID.NO2
    },
    {
      label: 'O',
      subscript: '3',
      phenomenonId: PhenomenonSeriesID.O3
    },
    {
      label: 'PM',
      subscript: '10',
      phenomenonId: PhenomenonSeriesID.PM10
    },
    {
      label: 'PM',
      subscript: '2.5',
      phenomenonId: PhenomenonSeriesID.PM25
    }
  ];

  private readyCounter: number;

  private error: boolean;

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

  public entryReady(error) {
    if (!error) {
      this.readyCounter--;
      if (this.readyCounter === 0) {
        this.ready.emit();
      }
    } else {
      this.error = true;
    }
  }

}
