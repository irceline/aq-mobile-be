import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum DrawerState {
  Open = 'open',
  Docked = 'docked'
}

@Injectable()
export class InfoOverlayService {

  public rawState = new BehaviorSubject(DrawerState.Docked);
  public state = this.rawState.asObservable();

  constructor(
  ) { }

  openClose() {
    if (this.rawState.value === DrawerState.Open) {
      this.rawState.next(DrawerState.Docked);
    } else {
      this.rawState.next(DrawerState.Open);
    }
  }
}
