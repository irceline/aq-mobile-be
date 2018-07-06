import { Component } from '@angular/core';
import { GeoSearch, GeosearchControlComponent, MapCache } from '@helgoland/map';
import { Keyboard } from 'ionic-angular';

@Component({
  selector: 'mobile-geosearch-control',
  templateUrl: 'mobile-geosearch-control.html'
})
export class MobileGeosearchControlComponent extends GeosearchControlComponent {

  constructor(
    protected mapCache: MapCache,
    protected geosearch: GeoSearch,
    protected keyboard: Keyboard
  ) {
    super(mapCache, geosearch);
  }

  public triggerSearch() {
    super.triggerSearch();
    this.keyboard.close();
  }
}
