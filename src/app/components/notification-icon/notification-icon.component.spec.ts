import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationIconPage } from './notification-icon.page';

describe('NotificationIconPage', () => {
  let component: NotificationIconPage;
  let fixture: ComponentFixture<NotificationIconPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationIconPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationIconPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
