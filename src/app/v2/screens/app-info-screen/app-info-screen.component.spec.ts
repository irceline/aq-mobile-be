import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInfoScreenComponent } from './app-info-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network/ngx';
import { SettingsService } from '@helgoland/core';
import { IonicModule } from '@ionic/angular';

xdescribe('AppInfoScreenComponent', () => {
    let component: AppInfoScreenComponent;
    let fixture: ComponentFixture<AppInfoScreenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppInfoScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                TranslateTestingModule,
                CacheModule.forRoot(),
                IonicModule
            ],
            providers: [FirebaseX, Network, SettingsService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppInfoScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
