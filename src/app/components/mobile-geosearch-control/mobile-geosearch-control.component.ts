import { Component, EventEmitter, Output } from '@angular/core';
import { GeoSearch, GeosearchControlComponent, MapCache } from '@helgoland/map';
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'mobile-geosearch-control',
  templateUrl: './mobile-geosearch-control.component.html',
  styleUrls: ['./mobile-geosearch-control.component.scss'],
})
export class MobileGeosearchControlComponent extends GeosearchControlComponent {

  @Output()
  public searchTriggered: EventEmitter<void> = new EventEmitter();

  constructor(
    protected mapCache: MapCache,
    protected geosearch: GeoSearch,
    protected keyboard: Keyboard
  ) {
    super(mapCache, geosearch);
  }

  public triggerSearch() {
    this.searchTriggered.emit();
    super.triggerSearch();
    this.keyboard.hide();
  }

}
