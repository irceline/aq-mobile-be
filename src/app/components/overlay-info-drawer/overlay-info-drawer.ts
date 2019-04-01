import 'hammerjs';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DomController, Platform } from '@ionic/angular';

export enum DrawerState {
  Open = 'open',
  Docked = 'docked'
}

@Component({
  selector: 'overlay-info-drawer',
  templateUrl: 'overlay-info-drawer.html',
  styleUrls: ['overlay-info-drawer.scss']
})
export class OverlayInfoDrawerComponent implements AfterViewInit, OnChanges {

  @Input() dockedHeight = 50;

  @Input() distanceBottom = 0;

  @Input() transition = '0.5s ease-in-out';

  @Input() state: DrawerState = DrawerState.Docked;

  @Input() minimumHeight = 0;

  @Output() stateChange: EventEmitter<DrawerState> = new EventEmitter<DrawerState>();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController,
    private platform: Platform
  ) { }

  ngAfterViewInit() {
    this.setDrawerState(this.state);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.state) { return; }
    this.setDrawerState(changes.state.currentValue);
  }

  openClose() {
    if (this.state === DrawerState.Open) {
      this.setDrawerState(DrawerState.Docked);
    } else {
      this.setDrawerState(DrawerState.Open);
    }
  }

  private setDrawerState(state: DrawerState) {
    this.renderer.setStyle(this.element.nativeElement, 'transition', this.transition);
    switch (state) {
      case DrawerState.Open:
        this.setTranslateY(this.distanceBottom + 'px');
        break;
      case DrawerState.Docked:
        this.setTranslateY(-(this.platform.height() - this.dockedHeight + 5) + 'px');
        break;
    }
    this.state = state;
  }

  private setTranslateY(value) {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(' + value + ')');
    });
  }
}
