import { Component, Input, SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {
  ServiceFilterSelectorComponent,
} from 'helgoland-toolbox/dist/components/selector/service-filter-selector/service-filter-selector.component';
import { Phenomenon } from 'helgoland-toolbox/dist/model/api/phenomenon';

@Component({
  selector: 'mobile-phenomenon-selector',
  templateUrl: 'mobile-phenomenon-selector.html'
})
export class MobilePhenomenonSelectorComponent extends ServiceFilterSelectorComponent implements OnChanges {

  @Input()
  public visiblePhenomenonIDs: string[];

  public isVisible(phenomenon: Phenomenon) {
    if (this.visiblePhenomenonIDs) {
      return this.visiblePhenomenonIDs.indexOf(phenomenon.id) >= 0 ? true : false;
    } else {
      return true;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
