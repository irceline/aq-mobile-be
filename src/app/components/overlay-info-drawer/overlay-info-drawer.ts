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
import { InfoOverlayService, DrawerState } from '../../services/overlay-info-drawer/overlay-info-drawer.service';

@Component({
  selector: 'overlay-info-drawer',
  templateUrl: 'overlay-info-drawer.html',
  styleUrls: ['overlay-info-drawer.scss']
})
export class OverlayInfoDrawerComponent implements OnChanges {
  
  @Input() distanceBottom = 0;

  @Input() transition = '0.5s ease-in-out';

  @Input() minimumHeight = 0;

  @Output() stateChange: EventEmitter<DrawerState> = new EventEmitter<DrawerState>();

  public docked = true;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController,
    private infoOverlayService: InfoOverlayService,
  ) {
    this.infoOverlayService.state.subscribe(state => this.setDrawerState(state));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.state) { return; }
    this.infoOverlayService.openClose();
  }

  openClose() {
    this.infoOverlayService.openClose();
  }

  private setDrawerState(state: DrawerState) {
    this.renderer.setStyle(this.element.nativeElement, 'transition', this.transition);
    switch (state) {
      case DrawerState.Open:
        this.docked = false;
        this.setTranslateY(this.distanceBottom + 'px');
        break;
      case DrawerState.Docked:
        this.docked = true;
        this.setTranslateY('calc(40px - 100%)');
        break;
    }
  }

  private setTranslateY(value) {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateY(' + value + ')');
    });
  }
}
