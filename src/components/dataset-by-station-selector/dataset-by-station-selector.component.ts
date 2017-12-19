import { Component } from '@angular/core';
import {
    DatasetByStationSelectorComponent,
} from 'helgoland-toolbox/dist/components/selector/dataset-by-station-selector/dataset-by-station-selector.component';

@Component({
    selector: 'n52-mobile-dataset-by-station-selector',
    templateUrl: 'dataset-by-station-selector.component.html'
})
export class MobileDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent { }
