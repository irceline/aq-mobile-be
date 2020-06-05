import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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

    @Input() language = '';

    @Output() languageChanged = new EventEmitter<string>();

    @ViewChild('select', { static: true }) select: ElementRef;

        constructor( private translate: TranslateService ) {

        // this does not do what you would expect
        // this._availableLanguages = this.translate.getLangs();

    }

    ngOnInit() {
    }

    selectLanguage(lang) {
        // Todo: test when dropdown is implemented
        this.languageChanged.emit(lang.detail.value);
    }
}
