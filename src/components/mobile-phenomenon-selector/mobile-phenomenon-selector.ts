import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Phenomenon } from '@helgoland/core';
import { ServiceFilterSelectorComponent } from '@helgoland/selector';

@Component({
  selector: 'mobile-phenomenon-selector',
  templateUrl: 'mobile-phenomenon-selector.html'
})
export class MobilePhenomenonSelectorComponent extends ServiceFilterSelectorComponent implements OnChanges {

  @Input()
  public visiblePhenomenonIDs: string[];

  @Input()
  public hiddenPhenomenonIDs: string[];

  public isVisible(phenomenon: Phenomenon) {
    if (this.visiblePhenomenonIDs) {
      return this.visiblePhenomenonIDs.indexOf(phenomenon.id) >= 0 ? true : false;
    } else if (this.hiddenPhenomenonIDs) {
      return this.hiddenPhenomenonIDs.indexOf(phenomenon.id) >= 0 ? false : true;
    } else {
      return true;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
