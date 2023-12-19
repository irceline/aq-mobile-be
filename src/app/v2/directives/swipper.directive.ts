import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import Swiper from 'swiper';

@Directive({
  selector: '[appSwiper]'
})
export class SwiperDirective implements AfterViewInit {
  @Input() config?: SwiperOptions;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {

    const config = {
      ...this.config,
    };

    console.log('swipper config', config)

    Object.assign(this.el.nativeElement, config);

    new Swiper(this.el.nativeElement, config);
  }
}
