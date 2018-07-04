import { Component, EventEmitter, Output } from '@angular/core';
import { Geoposition } from '@ionic-native/geolocation';

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

  public position: Geoposition;

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
      label: 'PM',
      id: '5'
    },
    {
      label: 'PM2.5',
      id: '6001'
    }
  ];

  constructor() { }

  public select(id: string) {
    this.onSelect.emit(id);
  }

}
