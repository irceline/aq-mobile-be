import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  AfterViewInit,
  ViewChild,
  NgZone,
  Output,
  EventEmitter
} from '@angular/core';
import { DomController, Platform, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import "hammerjs";

@Component({
  selector: 'app-pull-tab',
  templateUrl: './pull-tab.component.html',
  styleUrls: ['./pull-tab.component.scss', './pull-tab.component.hc.scss'],
})
export class PullTabComponent implements AfterViewInit {
  @Input('options') options: any;
  // @ts-ignore
  @Input('screenHeight') screenHeight: number;
  @Output() updateClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  // @ts-ignore
  @ViewChild('trigger', { static: true }) trigger: ElementRef;
  // @ts-ignore
  @ViewChild(IonContent, { static: true }) content: IonContent;

  handleHeight = 50;
  gap = 100;
  bounceBack = true;
  thresholdTop = 200;
  thresholdBottom = 200;
  isEnabled = false;

  isClicked = false;

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    public domCtrl: DomController,
    public platform: Platform,
    public zone: NgZone,
    public router: Router
  ) { }

  ngAfterViewInit() {
    if (this.options && this.options.handleHeight) {
      this.handleHeight = this.options.handleHeight;
    }

    if (this.options && this.options.gap) {
      this.gap = this.options.gap;
    }

    if (this.options && this.options.bounceBack) {
      this.bounceBack = this.options.bounceBack;
    }

    if (this.options && this.options.thresholdFromBottom) {
      this.thresholdBottom = this.options.thresholdFromBottom;
    }

    if (this.options && this.options.thresholdFromTop) {
      this.thresholdTop = this.options.thresholdFromTop;
    }

    this.renderer.setStyle(
      this.element.nativeElement,
      'top',
      this.screenHeight - this.handleHeight + 'px'
    );

    this.renderer.setStyle(
      this.element.nativeElement,
      'height',
      this.screenHeight - this.gap + 'px'
    );

    const trigger = new window['Hammer'](this.trigger.nativeElement);
    trigger
      .get('pan')
      .set({ direction: window['Hammer'].DIRECTION_VERTICAL });

    trigger.on('pan', (ev) => {
      this.handlePan(ev);
    });
  }

  handleTap() {
    if (!this.isClicked) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.element.nativeElement,
          'transition',
          'top 0.5s'
        );
        this.renderer.setStyle(
          this.element.nativeElement,
          'top',
          this.gap + 'px' // height from top when its opened
        );
      });
      this.isEnabled = true;
      this.isClicked = true;
      this.updateClicked.emit(true);
    } else {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.element.nativeElement,
          'transition',
          'top 0.5s'
        );
        this.renderer.setStyle(
          this.element.nativeElement,
          'top',
          this.screenHeight - this.handleHeight + 'px'
        );
      });
      this.isEnabled = false;
      this.isClicked = false;
      this.updateClicked.emit(false);
      this.content.scrollToTop(1000);
    }
  }

  handlePan(ev:any) {
    const newTop = ev.center.y;

    let bounceToBottom = false;
    let bounceToTop = false;

    if (this.bounceBack && ev.isFinal) {
      const topDiff = newTop - this.thresholdTop;
      const bottomDiff =
        this.screenHeight - this.thresholdBottom - newTop;

      topDiff >= bottomDiff
        ? (bounceToBottom = true)
        : (bounceToTop = true);
    }

    if (
      (newTop < this.thresholdTop && ev.additionalEvent === 'panup') ||
      bounceToTop
    ) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.element.nativeElement,
          'transition',
          'top 0.5s'
        );
        this.renderer.setStyle(
          this.element.nativeElement,
          'top',
          this.gap + 'px' // height from top when its opened
        );
      });
      this.zone.run(() => {
        this.isEnabled = true;
        this.updateClicked.emit(true);
      })
    } else if (
      this.screenHeight - newTop < this.thresholdBottom ||
      ev.additionalEvent === 'pandown' ||
      bounceToBottom
    ) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          this.element.nativeElement,
          'transition',
          'top 0.5s'
        );
        this.renderer.setStyle(
          this.element.nativeElement,
          'top',
          this.screenHeight - this.handleHeight + 'px'
        );
      });
      this.zone.run(() => {
        this.isEnabled = false;
        this.updateClicked.emit(false);
      })
    } else {
      this.renderer.setStyle(
        this.element.nativeElement,
        'transition',
        'none'
      );

      if (
        newTop > 0 &&
        newTop < this.screenHeight - this.handleHeight
      ) {
        if (
          ev.additionalEvent === 'panup' ||
          ev.additionalEvent === 'pandown'
        ) {
          this.domCtrl.write(() => {
            this.renderer.setStyle(
              this.element.nativeElement,
              'top',
              newTop + 'px'
            );
          });
        }
      }
    }
  }
}
