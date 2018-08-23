import { Component } from '@angular/core';
import { Time } from '@helgoland/core';
import { TimespanShiftSelectorComponent } from '@helgoland/time';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mobile-timespan-shift-selector',
  templateUrl: 'mobile-timespan-shift-selector.html'
})
export class MobileTimespanShiftSelectorComponent extends TimespanShiftSelectorComponent {

  constructor(
    timeSrvc: Time,
    protected translateSrvc: TranslateService
  ) {
    super(timeSrvc)
  };

}
