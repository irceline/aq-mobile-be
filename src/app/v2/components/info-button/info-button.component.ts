import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-info-button',
    templateUrl: './info-button.component.html',
    styleUrls: ['./info-button.component.scss'],
})
export class InfoButtonComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    onClick() {
        alert('go to info');
    }
}
