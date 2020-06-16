import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-language-dropdown',
    templateUrl: './language-dropdown.component.html',
    styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent implements OnInit {

    availableLanguages = [
        { langCode: 'en', label: 'English' },
        { langCode: 'nl', label: 'Nederlands' },
        { langCode: 'de', label: 'Deutsch' },
        { langCode: 'fr', label: 'Français' },
    ];

    public language: string;

    @ViewChild('select', { static: true }) select: ElementRef;

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.language = this.translate.currentLang;
    }

    selectLanguage(lang: CustomEvent) {
        this.translate.use(lang.detail.value);
    }
}
