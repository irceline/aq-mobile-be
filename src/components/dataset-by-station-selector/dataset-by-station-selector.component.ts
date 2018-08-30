import { Component } from '@angular/core';
import { DatasetApiInterface } from '@helgoland/core';
import { DatasetByStationSelectorComponent, ExtendedTimeseries } from '@helgoland/selector';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'n52-mobile-dataset-by-station-selector',
    templateUrl: 'dataset-by-station-selector.component.html'
})
export class MobileDatasetByStationSelectorComponent extends DatasetByStationSelectorComponent {

    public toggleShowAll: boolean = false;

    constructor(
        protected datasetApi: DatasetApiInterface,
        protected translateSrvc: TranslateService
    ) {
        super(datasetApi);
    }

    protected prepareResult(result: ExtendedTimeseries, selection: boolean) {
        super.prepareResult(result, this.phenomenonId === result.parameters.phenomenon.id);
    }
}
