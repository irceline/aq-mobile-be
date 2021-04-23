import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeedbackLocationEditComponent } from './feedback-location-edit.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeedbackLocationEditComponent', () => {
  let component: FeedbackLocationEditComponent;
  let fixture: ComponentFixture<FeedbackLocationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackLocationEditComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackLocationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
