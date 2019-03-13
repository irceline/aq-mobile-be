import { Component } from '@angular/core';

import { MapDataService } from '../services/map-data/map-data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private mapDataService: MapDataService
  ) { }

  public resetMapSelection() {
    this.mapDataService.selection = null;
  }

}
