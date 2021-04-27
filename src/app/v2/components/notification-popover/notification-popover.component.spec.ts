import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';

import { NotificationPopoverComponent } from './notification-popover.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';

describe('NotificationPopoverComponent', () => {
  let component: NotificationPopoverComponent;
  let fixture: ComponentFixture<NotificationPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPopoverComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule],
      providers: [NavParams]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
