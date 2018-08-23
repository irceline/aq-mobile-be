import { Component } from '@angular/core';
import { DatasetByStationSelectorComponent } from '@helgoland/selector';

@Component({
    selector: 'n52-mobile-dataset-by-station-selector',
    templateUrl: 'dataset-by-station-selector.component.html'
})
export class MobileDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent {

    public toggleShowAll: boolean = false;

}
