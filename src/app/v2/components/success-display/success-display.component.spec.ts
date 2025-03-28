import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessDisplayComponent } from './success-display.component';
import {RouterModule} from '@angular/router';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';

describe('SuccessDisplayComponent', () => {
  let component: SuccessDisplayComponent;
  let fixture: ComponentFixture<SuccessDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessDisplayComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule.forRoot([]), TranslateTestingModule, IonicModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
