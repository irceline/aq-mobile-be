import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutScreenComponent } from './layout-screen.component';
import {UserLocationsService} from '../../services/user-locations.service';
import {UserLocationServiceMock} from '../../testing/userlocationservice.mock';

xdescribe('LayoutScreenComponent', () => {
  let component: LayoutScreenComponent;
  let fixture: ComponentFixture<LayoutScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutScreenComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: UserLocationsService, useClass: UserLocationServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
