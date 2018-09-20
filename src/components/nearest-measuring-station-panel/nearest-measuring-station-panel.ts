import { Component, EventEmitter, Input, Output } from '@angular/core';

import { LocateProvider } from '../../providers/locate/locate';
import { UserLocation } from '../../providers/user-location-list/user-location-list';

interface PanelEntry {
  label: string;
  id: string;
}

@Component({
  selector: 'nearest-measuring-station-panel',
  templateUrl: 'nearest-measuring-station-panel.html'
})
export class NearestMeasuringStationPanelComponent {

  @Output()
  public onSelect: EventEmitter<string> = new EventEmitter();

  @Input()
  public location: UserLocation;

  public geolocationEnabled: boolean;

  public entries: PanelEntry[] = [
    {
      label: 'BC',
      id: '391'
    },
    {
      label: 'NO2',
      id: '8'
    },
    {
      label: 'O3',
      id: '7'
    },
    {
      label: 'PM10',
      id: '5'
    },
    {
      label: 'PM2.5',
      id: '6001'
    }
  ];

  constructor(
    private locate: LocateProvider
  ) {
    this.locate.getLocationStateEnabled().subscribe(res => this.geolocationEnabled = res);
  }

  public select(id: string) {
    this.onSelect.emit(id);
  }

}
