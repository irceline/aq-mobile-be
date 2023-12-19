import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserLocation } from '../../Interfaces';


@Component({
  selector: 'app-onboarding-slider',
  templateUrl: './onboarding-slider.component.html',
  styleUrls: ['./onboarding-slider.component.scss', './onboarding-slider.component.hc.scss'],
})
export class OnboardingSliderComponent implements OnInit, OnChanges {
  @Input() disabled: boolean = false;

  @Output() slideShowComplete = new EventEmitter();

  @ViewChild('slider') slides!: ElementRef;

  public btnText: string;

  constructor(private translate: TranslateService) {
    this.btnText = translate.instant(
      'v2.components.onboarding-slider.btn-text'
    );
  }

  async ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'].currentValue) {
      this.slides?.nativeElement.swiper.disable();
    } else {
      this.slides?.nativeElement.swiper.enable();
    }
  }

  // Logic for next button
  next() {
    const isEnd = this.slides?.nativeElement.swiper.isEnd;
    if (isEnd) {
      this.slideShowComplete.emit();
    } else {
      this.slides?.nativeElement.swiper.slideNext(500, false);
    }
  }

  // Changing the text when reaches the end of slides
  slideChanged() {
    const isEnd = this.slides?.nativeElement.swiper.isEnd;
    if (isEnd) {
      this.btnText = this.translate.instant(
        'v2.components.onboarding-slider.start-app'
      );
    } else {
      this.btnText = this.translate.instant(
        'v2.components.onboarding-slider.btn-text'
      );
    }
  }
}
