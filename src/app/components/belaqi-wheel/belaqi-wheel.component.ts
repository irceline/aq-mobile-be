import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LanguageChangNotifier } from '@helgoland/core';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartOptions } from 'chart.js';

import { BelaqiIndexService } from '../../services/belaqi/belaqi.service';
import { BelaqiWheelInformationComponent } from './belaqi-wheel-information.component';

interface ExtendedChartOptions extends ChartOptions {
  values: {
    index: number;
  };
}

@Component({
  selector: 'belaqi-wheel',
  templateUrl: './belaqi-wheel.component.html',
  styleUrls: ['./belaqi-wheel.component.scss'],
})
export class BelaqiWheelComponent extends LanguageChangNotifier implements AfterContentInit, OnChanges {

  @Input()
  public latitude: number;

  @Input()
  public longitude: number;

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  @ViewChild('belaqiWheel', { static: true }) belaqiWheelCanvas: ElementRef;
  belaqiWheel: Chart;

  public index: number;
  public error = false;
  public loading = false;

  constructor(
    private belaqi: BelaqiIndexService,
    private popoverCtrl: PopoverController,
    protected translate: TranslateService,
  ) {
    super(translate);
  }

  protected languageChanged(): void {
    this.drawWheel();
  }

  public ngAfterContentInit(): void {
    this.drawWheel();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.latitude || changes.longitude) {
      this.fetchIndex();
    }
  }

  public fetchIndex() {
    if (this.latitude && this.longitude) {
      this.loading = true;
      this.belaqi.getValue(this.latitude, this.longitude)
        .subscribe(
          res => {
            this.index = res;
            this.loading = false;
            this.drawWheel();
          },
          error => {
            this.error = true;
            this.loading = false;
            this.ready.emit();
          }
        );
    }
  }

  public async presentPopover() {
    this.popoverCtrl.create({
      component: BelaqiWheelInformationComponent
    }).then(popover => popover.present());
  }

  private getEmHeight() {
    const div = document.getElementById('check-height-div');
    div.style.height = '1em';
    const height = div.offsetHeight;
    div.style.height = '0';
    return height;
  }

  private wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, emFactor: number) {
    if (text) {
      const lineHeight = this.getEmHeight() * emFactor;
      const words = text.split(' ');
      let line = '';
      let multiline = false;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          multiline = true;
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      if (multiline) {
        context.fillText(line, x, y);
      } else {
        context.fillText(line, x, y + lineHeight / 2);
      }
    }
  }

  private drawWheel() {
    if (this.index) {
      const canvas = this.belaqiWheelCanvas.nativeElement as HTMLCanvasElement;
      this.belaqiWheel = new Chart(canvas, {
        type: 'doughnut',
        plugins: [{
          afterDraw: (chartInstance: Chart, easing: string, options?: any) => {
            const index = (chartInstance['chart'].options as ExtendedChartOptions).values.index;

            const width = chartInstance.chartArea.right - chartInstance.chartArea.left;
            const height = chartInstance.chartArea.bottom - chartInstance.chartArea.top;
            const centerX = width / 2;
            const centerY = height / 2 + 10;
            const radius = Math.min(width, height) / 3.8;
            const offset = radius / 2;
            const pointerColor = '#FFFFFF';
            const borderColor = this.belaqi.getColorForIndex(index);
            const lineWidth = 3;

            const ctx = chartInstance.ctx;

            ctx.save();

            ctx.fillStyle = pointerColor;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';

            // arrow
            ctx.beginPath();
            if (index > 0 && index <= 10) {
              const step = (Math.PI / 6);
              const start = 3.5 * step;
              const angle = start + index * step;
              const arrowGap = 0.25;

              // circle
              ctx.beginPath();
              ctx.arc(width / 2, height / 2 + 10, radius, angle + arrowGap, angle - arrowGap);
              ctx.fill();
              ctx.stroke();

              // ctx.moveTo(centerX, centerY);
              // ctx.lineTo(centerX + Math.cos(angle - arrowGap) * radius, centerY + Math.sin(angle - arrowGap) * radius);
              ctx.moveTo(centerX + Math.cos(angle - arrowGap) * radius, centerY + Math.sin(angle - arrowGap) * radius);
              ctx.lineTo(centerX + Math.cos(angle) * (radius + offset), centerY + Math.sin(angle) * (radius + offset));
              ctx.lineTo(centerX + Math.cos(angle + arrowGap) * radius, centerY + Math.sin(angle + arrowGap) * radius + 0.42);
              ctx.fill();
              ctx.stroke();
            }
            // manually set color to var(--ion-color-dark-tint)
            ctx.fillStyle = '#383a3e';
            ctx.textAlign = 'center';

            // indexLabel
            ctx.font = '1.3em Open Sans';
            this.wrapText(ctx, this.belaqi.getLabelForIndexSplit(index), centerX + 2, centerY - 14, 90, 1.2);
            ctx.font = '0.8em Open Sans';
            this.wrapText(ctx, index + '/10', centerX + 2, centerY + 17, 90, 2);

            // modelledLabel
            this.ready.emit();
          }
        }],
        options: {
          cutoutPercentage: 70,
          circumference: (20 / 12) * Math.PI,
          tooltips: {
            enabled: false
          },
          maintainAspectRatio: false,
          rotation: 1 / 12 * 8 * Math.PI,
          legend: {
            display: false
          },
          values: {
            index: this.index
          },
          events: []
        } as ExtendedChartOptions,
        data: {
          datasets: [{
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: [
              this.belaqi.getColorForIndex(1),
              this.belaqi.getColorForIndex(2),
              this.belaqi.getColorForIndex(3),
              this.belaqi.getColorForIndex(4),
              this.belaqi.getColorForIndex(5),
              this.belaqi.getColorForIndex(6),
              this.belaqi.getColorForIndex(7),
              this.belaqi.getColorForIndex(8),
              this.belaqi.getColorForIndex(9),
              this.belaqi.getColorForIndex(10)
            ]
          }]
        }
      });
    }
  }
}
