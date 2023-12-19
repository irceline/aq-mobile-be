import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss', './language-dropdown.component.hc.scss'],
})
export class LanguageDropdownComponent implements OnInit {

  availableLanguages:any[] = [];

  public language: string;

  // @ts-ignore
  @ViewChild('select', { static: true }) select: ElementRef;

  constructor(
    private translate: TranslateService,
    private settingsSrvc: SettingsService<Settings>
  ) {

    this.language = this.translate.currentLang;
  }

  ngOnInit() {
    // @ts-ignore
    this.availableLanguages = this.settingsSrvc.getSettings().languages;
  }

  selectLanguage(lang: CustomEvent) {
    this.translate.use(lang.detail.value);
  }
}
