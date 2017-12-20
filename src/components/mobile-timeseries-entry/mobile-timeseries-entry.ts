import { Component } from '@angular/core';
import {
    TimeseriesEntryComponent,
} from 'helgoland-toolbox/dist/components/datasetlist/timeseries-entry/timeseries-entry.component';

@Component({
  selector: 'mobile-timeseries-entry',
  templateUrl: 'mobile-timeseries-entry.html'
})
export class MobileTimeseriesEntryComponent extends TimeseriesEntryComponent { }
