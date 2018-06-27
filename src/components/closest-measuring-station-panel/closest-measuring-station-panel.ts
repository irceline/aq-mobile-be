import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular/platform/platform';

interface PanelEntry {
  label: string;
  id: string;
}

@Component({
  selector: 'closest-measuring-station-panel',
  templateUrl: 'closest-measuring-station-panel.html'
})
export class ClosestMeasuringStationPanelComponent implements OnInit {

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

  constructor(
    private platform: Platform,
    private geolocate: Geolocation
  ) { }

  public ngOnInit(): void {
    this.determinePosition();
  }

  public select(id: string) {
    this.onSelect.emit(id);
  }

  private determinePosition() {
    this.platform.ready().then(() => {
      this.geolocate.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 60000
      }).then(res => {
        this.position = res;
        // const latitude = 50.863892;
        // const longitude = 4.6337528;
        // const latitude = 50 + Math.random();
        // const longitude = 4 + Math.random();
        // this.position = {
        //   coords: {
        //     latitude: latitude,
        //     longitude: longitude,
        //     accuracy: 0,
        //     altitude: 0,
        //     altitudeAccuracy: 0,
        //     heading: 0,
        //     speed: 0
        //   },
        //   timestamp: 1234
        // }
      }).catch((error) => console.log(JSON.stringify(error)));
    })
  }

}
