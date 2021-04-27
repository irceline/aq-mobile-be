import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParameterInformationComponent } from './parameter-information.component';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';

describe('ParameterInformationComponent', () => {
  let component: ParameterInformationComponent;
  let fixture: ComponentFixture<ParameterInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterInformationComponent ],
      imports: [IonicModule.forRoot(), TranslateTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
