import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationIconPopupPage } from './notification-icon-popup.page';

describe('NotificationIconPopupPage', () => {
  let component: NotificationIconPopupPage;
  let fixture: ComponentFixture<NotificationIconPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationIconPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationIconPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
