import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingScreenComponent } from './rating-screen.component';
import {UserSettingsService} from '../../services/user-settings.service';
import {UserLocationServiceMock} from '../../testing/userlocationservice.mock';

xdescribe('RatingScreenComponent', () => {
  let component: RatingScreenComponent;
  let fixture: ComponentFixture<RatingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingScreenComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: UserSettingsService, useClass: UserLocationServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
