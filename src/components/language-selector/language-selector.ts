import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'language-selector',
  templateUrl: 'language-selector.html'
})
export class LanguageSelectorComponent extends LocalSelectorComponent {
  constructor(public translate: TranslateService) {
    super(translate)
  }
}
