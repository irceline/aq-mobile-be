import { Component, EventEmitter, Output } from '@angular/core';
import { GeoSearch, GeosearchControlComponent, MapCache } from '@helgoland/map';
import { Keyboard } from 'ionic-angular';

@Component({
  selector: 'mobile-geosearch-control',
  templateUrl: 'mobile-geosearch-control.html'
})
export class MobileGeosearchControlComponent extends GeosearchControlComponent {

  @Output()
  public onSearchTriggered: EventEmitter<void> = new EventEmitter();

  constructor(
    protected mapCache: MapCache,
    protected geosearch: GeoSearch,
    protected keyboard: Keyboard
  ) {
    super(mapCache, geosearch);
  }

  public triggerSearch() {
    this.onSearchTriggered.emit();
    super.triggerSearch();
    this.keyboard.close();
  }
}
