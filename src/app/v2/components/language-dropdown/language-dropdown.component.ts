import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-language-dropdown',
    templateUrl: './language-dropdown.component.html',
    styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent implements OnInit {

    private _availableLanguages = [
        { langCode: 'en', label: 'English' },
        { langCode: 'nl', label: 'Nederlands' },
        { langCode: 'de', label: 'Deutsch' },
        { langCode: 'fr', label: 'Français' },
    ];

    @Input() language = '';

    @Output() languageChanged = new EventEmitter<string>();

    @ViewChild('select') select: ElementRef;

    constructor( private translate: TranslateService ) {

        // this does not do what you would expect
        // this._availableLanguages = this.translate.getLangs();

    }

    ngOnInit() {
        // Removing the arrow from select, temp solution because Ionic dont have for now property to remove arrow
        setTimeout(() => {
            const ionSelects = document.querySelectorAll('ion-select');
            if (ionSelects.length) {
                ionSelects[0].shadowRoot.children[1].setAttribute(
                    'style',
                    'display: none !important'
                );
            }
        }, 500);
    }

    selectLanguage(lang) {
        // Todo: test when dropdown is implemented
        this.languageChanged.emit(lang.detail.value);
    }
}
