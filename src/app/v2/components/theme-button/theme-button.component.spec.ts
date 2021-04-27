import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeButtonComponent } from './theme-button.component';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';

describe('ThemeButtonComponent', () => {
  let component: ThemeButtonComponent;
  let fixture: ComponentFixture<ThemeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeButtonComponent ],
      imports: [IonicStorageModule.forRoot(), TranslateTestingModule],
      providers: [StatusBar]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
