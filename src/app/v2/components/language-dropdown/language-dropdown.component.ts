import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-language-dropdown',
    templateUrl: './language-dropdown.component.html',
    styleUrls: ['./language-dropdown.component.scss'],
})
export class LanguageDropdownComponent implements OnInit {
    @Input() language = '';
    @ViewChild('select') select: ElementRef;

    constructor() {}

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
}
