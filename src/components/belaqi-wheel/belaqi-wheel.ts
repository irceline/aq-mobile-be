import { AfterContentInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { LanguageChangNotifier } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartOptions } from 'chart.js';
import { PopoverController } from 'ionic-angular';

import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { BelaqiWheelInformationComponent } from './belaqi-wheel-information';

interface ExtendedChartOptions extends ChartOptions {
  values: {
    index: number;
  }
}

@Component({
  selector: 'belaqi-wheel',
  templateUrl: 'belaqi-wheel.html'
})
export class BelaqiWheelComponent extends LanguageChangNotifier implements AfterContentInit, OnChanges {

  @Input()
  public index: number;

  @ViewChild('belaqiWheel') belaqiWheelCanvas: ElementRef;
  belaqiWheel: Chart;

  constructor(
    private belaqi: BelaqiIndexProvider,
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
    if (changes.index) {
      this.drawWheel();
    }
  }

  public presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(BelaqiWheelInformationComponent);
    popover.present({ ev: myEvent });
  }

  private getEmHeight() {
    const div = document.getElementById('check-height-div');
    div.style.height = '1em';
    return div.offsetHeight;
  }

  private wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, emFactor: number) {
    if (text) {
      const lineHeight = this.getEmHeight() * emFactor;
      var words = text.split(' ');
      var line = '';
      var multiline = false;
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          multiline = true;
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
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

            const width = chartInstance.chartArea.right - chartInstance.chartArea.left;
            const height = chartInstance.chartArea.bottom - chartInstance.chartArea.top;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 5;
            const offset = radius / 2;
            const pointerColor = '#FFFFFF';
            const borderColor = '#000000';
            const lineWidth = 3;

            const ctx = chartInstance.ctx;

            ctx.save();

            ctx.fillStyle = pointerColor;
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';

            // arrow
            ctx.beginPath();
            const index = (chartInstance['chart'].options as ExtendedChartOptions).values.index;
            if (index > 0 && index <= 10) {
              const step = (Math.PI / 6);
              const start = 3.5 * step;
              const angle = start + index * step;
              const arrowGap = 0.25;

              // circle
              ctx.beginPath();
              ctx.arc(width / 2, height / 2, radius, angle + arrowGap, angle - arrowGap);
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

            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';

            // indexLabel
            ctx.font = "1.2em Roboto";
            this.wrapText(ctx, this.belaqi.getLabelForIndexSplit(index), centerX + 2, centerY - 3, 90, 1.2);

            // modelledLabel
            ctx.font = "0.6em Roboto";
            this.wrapText(ctx, this.translate.instant('belaqi-wheel.modelled-hint'), centerX, centerY + (radius * 1.7), 90, 0.6);
          }
        }],
        options: {
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
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
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
              this.belaqi.getColorForIndex(10),
              '#FFFFFF'
            ]
          }]
        }
      });
    }
  }

}
