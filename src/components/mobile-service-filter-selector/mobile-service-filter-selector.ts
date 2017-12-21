import { Component } from '@angular/core';
import {
  ServiceFilterSelectorComponent,
} from 'helgoland-toolbox/dist/components/selector/service-filter-selector/service-filter-selector.component';

@Component({
  selector: 'mobile-service-filter-selector',
  templateUrl: 'mobile-service-filter-selector.html'
})
export class MobileServiceFilterSelectorComponent extends ServiceFilterSelectorComponent { }
