import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

import { ValueDate } from '../../common/enums';
import { BelAqiIndexResult } from '../../services/bel-aqi.service';

@Component({
  selector: 'app-time-line-list',
  templateUrl: './time-line-list.component.html',
  styleUrls: ['./time-line-list.component.scss', './time-line-list.component.hc.scss'],
})
export class TimeLineListComponent implements OnChanges, AfterViewInit {
  @ViewChild('slider') slides!: ElementRef<SwiperContainer>;
  @Input() items: BelAqiIndexResult[] = [];
  @Input() activeSlideIndex: number = ValueDate.CURRENT;
  @Output() dayChange = new EventEmitter<BelAqiIndexResult>();

  public timelineOptions: SwiperOptions = {
    spaceBetween: 5,
    slidesPerView: 3.5,
    shortSwipes: true,
    centeredSlides: true
  };

  constructor(
    private platform: Platform
  ) {

  }

  ngAfterViewInit() {
    if (this.slides) {
      if (this.platform.is('ipad') || this.platform.is('tablet')) {
        this.timelineOptions.slidesPerView = 5;
      }

      Object.keys(this.timelineOptions).forEach(key => {
        const value = this.timelineOptions[key];
        this.slides.nativeElement.setAttribute(this.toKebabCase(key), `${value}`);
      });

      if (this.activeSlideIndex) {
        setTimeout(() => {
          this.slideTo(this.activeSlideIndex);
        }, 500);
      }

      this.slides.nativeElement.swiper.update();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items && this.items.length > 0) {
      if (this.platform.is('ipad') || this.platform.is('tablet')) {
        this.timelineOptions.slidesPerView = 5;
      }

      if (this.slides) {
        Object.keys(this.timelineOptions).forEach(key => {
          const value = this.timelineOptions[key];
          this.slides.nativeElement.setAttribute(this.toKebabCase(key), `${value}`);
        });

        this.slides.nativeElement.setAttribute(this.toKebabCase('initialSlide'), `3`);
        if (this.activeSlideIndex) {
          this.slideTo(this.activeSlideIndex);
        }
        this.slides.nativeElement.swiper.update();
      }
    }
  }

  // Emit index result change
  async slideChange(event: any) {
    const index = this.slides.nativeElement.swiper.activeIndex;
    // console.log('slideChange', index);
    const newIndexResult = { ...this.items[index]};
    this.dayChange.next(newIndexResult);
  }

  toKebabCase(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  slideTo(value: number) {
    this.slides.nativeElement.swiper.slideTo(value);
  }
}
