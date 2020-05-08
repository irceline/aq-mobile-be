import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageDropdownComponent} from './language-dropdown.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {By} from '@angular/platform-browser';

const _availableLanguages = [
    {langCode: 'en', label: 'English'},
    {langCode: 'nl', label: 'Nederlands'},
    {langCode: 'de', label: 'Deutsch'},
    {langCode: 'fr', label: 'Français'},
];

xdescribe('LanguageDropdownComponent', () => {
    let component: LanguageDropdownComponent;
    let fixture: ComponentFixture<LanguageDropdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LanguageDropdownComponent],
            imports: [TranslateTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
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
        spyOn(component.languageChanged, 'emit');
        _availableLanguages.forEach(x => {
            const event = new CustomEvent('ionChange', {
                detail: {value: x.langCode}
            });
            component.selectLanguage(event);
            expect(component.languageChanged.emit).toHaveBeenCalled();
            expect(component.languageChanged.emit).toHaveBeenCalledWith(x.langCode);
        });
    });
});
