import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { LanguageDropdownComponent } from './language-dropdown.component';
import { SettingsService } from '@helgoland/core';

const _availableLanguages = [
    { langCode: 'en', label: 'English' },
    { langCode: 'nl', label: 'Nederlands' },
    { langCode: 'de', label: 'Deutsch' },
    { langCode: 'fr', label: 'Français' },
];

describe('LanguageDropdownComponent', () => {
    let component: LanguageDropdownComponent;
    let fixture: ComponentFixture<LanguageDropdownComponent>;
    let translateSrvc: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LanguageDropdownComponent],
            imports: [TranslateTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [SettingsService]
        }).compileComponents();
        translateSrvc = TestBed.inject(TranslateService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have dropdown with languages', () => {
        const elements: HTMLSelectElement[] = fixture.debugElement.queryAll(By.css('ion-item > ion-select > ion-select-option'))
            .map(x => x.nativeElement);
        for (let i = 0; i < elements.length - 1; i++) {
            expect(elements[i].value).toEqual(_availableLanguages[i].langCode);
            expect(elements[i].innerText.trim()).toEqual(_availableLanguages[i].label);
        }
    });

    it('should select language on change', () => {
        _availableLanguages.forEach(x => {
            const event = new CustomEvent('ionChange', {
                detail: { value: x.langCode }
            });
            component.selectLanguage(event);
            expect(translateSrvc.currentLang).toEqual(x.langCode);
        });
    });
});
