import { AfterViewInit, Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { CombinedMapPage } from '../../pages/combined-map/combined-map';
import { DiagramPage } from '../../pages/diagram/diagram';
import { SettingsPage } from '../../pages/settings/settings';
import { StartPage } from '../../pages/start/start';

export enum PageType {
  start = 'StartPage',
  map = 'CombinedPage',
  diagram = 'DiagramPage',
  settings = 'SettingsPage',
}

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.html'
})
export class NavigationComponent implements AfterViewInit {

  private nav: NavController;

  public pageType = PageType;

  public selectedPage: PageType;

  constructor(
    private app: App
  ) { }

  ngAfterViewInit(): void {
    if (!this.nav) {
      this.nav = this.app.getRootNav();
      this.nav.viewDidLoad.subscribe((view) => {
        if (this.nav.length() > 2) {
          this.nav.remove(1, 1);
        }
        switch (view.instance.constructor.name) {
          case 'StartPage':
            this.selectedPage = PageType.start;
            break;
          case 'CombinedMapPage':
            this.selectedPage = PageType.map;
            break;
          case 'DiagramPage':
            this.selectedPage = PageType.diagram;
            break;
          case 'SettingsPage':
            this.selectedPage = PageType.settings;
            break;
        }
      });
    }
  }

  public openPage(pagetype: PageType) {
    if (!this.nav) {
      this.nav = this.app.getRootNav();
    }
    const component = this.getMatchingPage(pagetype);
    if (this.nav.getActive().name != component.name) {
      if (component.name !== 'StartPage') {
        this.nav.push(component);
      } else {
        this.selectedPage = PageType.start;
        this.nav.pop();
      }
    }
  }

  private getMatchingPage(pageType: PageType) {
    switch (pageType) {
      case PageType.start:
        return StartPage;
      case PageType.map:
        return CombinedMapPage;
      case PageType.diagram:
        return DiagramPage;
      case PageType.settings:
        return SettingsPage;
    }
  }

}
