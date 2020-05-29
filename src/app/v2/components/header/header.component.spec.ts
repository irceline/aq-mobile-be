import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {NavController} from '@ionic/angular';
import {NavControllerMock} from '../../testing/nav-controller.mock';
import {TranslateTestingModule} from '../../testing/TranslateTestingModule';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenuScreenComponent} from '../menu-screen/menu-screen.component';
import {By} from '@angular/platform-browser';
import {lightIndexColor} from '../../common/constants';
import {BelAQIService} from '../../services/bel-aqi.service';
import {localStorageMock} from '../../testing/localStorage.mock';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let navCtrl: NavController;
  let belAqiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          HeaderComponent,
          MenuScreenComponent
      ],
      providers: [
        { provide: NavController, useClass: NavControllerMock }
      ],
      imports: [
          TranslateTestingModule,
          RouterTestingModule,
          BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    navCtrl = TestBed.get(NavController);
    belAqiService = TestBed.get(BelAQIService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to rating screen', () => {
    spyOn(navCtrl, 'navigateForward');
    component.onRatingScreen = false;
    component.clickRating();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith(['main/rating']);
  });

  it('should navigate back from rating screen', () => {
    spyOn(navCtrl, 'navigateBack');
    component.onRatingScreen = true;
    component.clickRating();
    expect(navCtrl.navigateBack).toHaveBeenCalledWith(['main']);
  });

  it('should hide menu on initial load', () => {
    expect(component.menuVisible).toBe(false);
    const de = fixture.debugElement;
    const menuScreen = de.query(By.css('app-menu-screen'));
    const menuDiv = menuScreen.query(By.css('div'));
    expect(menuDiv).toBeNull();
  });

  it('should show menu after click', () => {
    component.toggleMenu();
    expect(component.menuVisible).toBe(true);
    fixture.detectChanges();
    const de = fixture.debugElement;
    const menuScreen = de.query(By.css('app-menu-screen'));
    const menuDiv = menuScreen.query(By.css('div'));
    expect(menuDiv).toBeDefined();
  });

  it('should display proper background color', () => {
    component.belAqi = 7;
    fixture.detectChanges();
    expect(component.backgroundColor).toEqual(lightIndexColor[7]);
  });

  it('should change background color when index changes', () => {
    const indexes = localStorageMock.getIndexScores(5, 5);
    const tempIndex = indexes[3];
    belAqiService.$activeIndex.next(tempIndex);
    fixture.detectChanges();
    expect(component.backgroundColor).toEqual(lightIndexColor[tempIndex.indexScore]);
  });
});
