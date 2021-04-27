import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongtermInfoScreenComponent } from './longterm-info-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateTestingModule } from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';

describe('LongtermInfoScreenComponent', () => {
    let component: LongtermInfoScreenComponent;
    let fixture: ComponentFixture<LongtermInfoScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LongtermInfoScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [RouterTestingModule, TranslateTestingModule, HttpClientTestingModule, CacheModule.forRoot(), IonicModule],
            providers: [Network, SettingsService, Firebase]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LongtermInfoScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
