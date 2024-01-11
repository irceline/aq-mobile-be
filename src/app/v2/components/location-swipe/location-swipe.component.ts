import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { UserLocation } from '../../Interfaces';

@Component({
  selector: 'app-location-swipe',
  templateUrl: './location-swipe.component.html',
  styleUrls: ['./location-swipe.component.scss', './location-swipe.component.hc.scss'],
})
export class LocationSwipeComponent implements OnInit, AfterViewInit {
  private eventsSubscription!: Subscription;

  @ViewChild('slider') slides!: ElementRef<SwiperContainer>;
  @Output() locationChange = new EventEmitter<UserLocation>();
  @Input() locations: UserLocation[] = [];
  @Input() slideEvent!: Observable<number>;
  private _activeIndex!: number;

  @Input() set activeIndex(value: number) {
    this._activeIndex = value;
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  private sliderOptions: SwiperOptions = {
    spaceBetween: 20,
    slidesPerView: 2,
    centeredSlides: true,
    shortSwipes: true,
  };

  constructor() { }

  ngAfterViewInit() {
    console.log('after init')
    if (this.slides) {
      Object.keys(this.sliderOptions).forEach(key => {
        const value = this.sliderOptions[key];
        this.slides.nativeElement.setAttribute(this.toKebabCase(key), `${value}`);
      });
      this.slides.nativeElement.swiper.update();
    }
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (!isNaN(this.activeIndex)) {
        this.slides.nativeElement.swiper.slideTo(this.activeIndex);
        this.slides.nativeElement.swiper.update();
    }

    if (this.slideEvent) {
        this.eventsSubscription = this.slideEvent.subscribe((index) => {
            this.activeIndex = index
            this.slides.nativeElement.swiper.slideTo(index);
            this.slides.nativeElement.swiper.update();
        });
    }
  }

  // Emit location change
  async slideChange() {
    console.log('LocationSwipe slideChange')
    const index = this.slides.nativeElement.swiper.realIndex;
    const location = this.locations[index];
    this.locationChange.next(location);
  }

  toKebabCase(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
