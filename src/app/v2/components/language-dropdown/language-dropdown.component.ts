import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-language-dropdown',
    templateUrl: './language-dropdown.component.html',
    styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent implements OnInit {

    availableLanguages = [];

    public language: string;

    @ViewChild('select', { static: true }) select: ElementRef;

    constructor(
        private translate: TranslateService,
        private settingsSrvc: SettingsService<Settings>
    ) { }

    ngOnInit() {
        this.language = this.translate.currentLang;
        this.availableLanguages = this.settingsSrvc.getSettings().languages;
    }

    selectLanguage(lang: CustomEvent) {
        this.translate.use(lang.detail.value);
    }
}
