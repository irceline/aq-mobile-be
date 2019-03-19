import 'chartjs-plugin-annotation';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Chart, ChartOptions } from 'chart.js';

import { BelaqiIndexService, BelaqiTimelineEntry } from '../../services/belaqi/belaqi.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { BelaqiChartInformationComponent } from './belaqi-chart-information.component';

interface ExpandedChartOptions extends ChartOptions {
  annotation: any;
}

const FORCAST_UNCERTAINTY_BUFFER_FACTOR = 0.1;

@Component({
  selector: 'belaqi-chart',
  templateUrl: 'belaqi-chart.component.html',
  styleUrls: ['./belaqi-chart.component.scss']
})
export class BelaqiChartComponent implements OnChanges {

  @ViewChild('chart') barCanvas;

  @Input()
  public location: UserLocation;

  @Output()
  public ready: EventEmitter<void> = new EventEmitter();

  public error: boolean;
  public loading: boolean;

  constructor(
    private belaqiIndex: BelaqiIndexService,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && this.location) {
      this.loading = true;
      this.belaqiIndex.getTimeline(this.location.latitude, this.location.longitude, this.location.date)
        .subscribe(
          res => this.drawChart(res),
          error => this.handleError(error));
    }
  }

  public presentPopover(myEvent) {
    this.popoverCtrl.create({
      component: BelaqiChartInformationComponent,
      event: myEvent
    }).then(popover => popover.present());
  }

  private handleError(error) {
    console.warn(error);
    this.error = true;
    this.loading = false;
    this.ready.emit();
  }

  private drawChart(belaqiTimeline: BelaqiTimelineEntry[]) {
    this.loading = false;
    const canvas = this.barCanvas.nativeElement as HTMLCanvasElement;
    if (canvas.clientHeight <= 0) { return; }
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      plugins: [{
        resize: c => this.drawData(ctx, c, belaqiTimeline)
      }],
      options: {
        legend: {
          display: false
        },
        annotation: {
          drawTime: 'beforeDatasetsDraw',
          events: ['click'],
          dblClickSpeed: 350,
          annotations: [{
            id: 'currentline',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: this.location.date.getHours().toString(),
            borderColor: '#26b8eb',
            borderWidth: 2,
          }]
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 1,
              max: 10,
              reverse: false,
              display: false
            }
          }]
        },
        layout: {
          padding: 10
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: (tooltip, data) => {
              return ' ' + this.belaqiIndex.getValueForIndex(parseInt(tooltip.yLabel, 10)) +
                ' - ' + this.belaqiIndex.getLabelForIndex(parseInt(tooltip.yLabel, 10));
            },
            labelColor: (tooltip) => {
              return {
                borderColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel, 10)),
                backgroundColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel, 10))
              };
            },
            title: () => ''
          }
        }
      } as ExpandedChartOptions,
      data: {
        labels: this.createLabels(belaqiTimeline),
        datasets: [
          {
            pointBorderWidth: 0,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            fill: false,
            cubicInterpolationMode: 'monotone',
            borderWidth: 2,
            data: []
          },
          {
            pointBorderWidth: 0,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            borderWidth: 2,
            data: []
          },
          {
            pointBorderWidth: 0,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: false,
            cubicInterpolationMode: 'monotone',
            borderWidth: 2,
            data: []
          }
        ]
      }
    });
    this.drawData(ctx, chart, belaqiTimeline);
    this.drawBuffer(chart, belaqiTimeline);
    this.ready.emit();
  }

  private drawBuffer(chart: Chart, belaqiTimeline: BelaqiTimelineEntry[]) {
    const upperDs = chart.data.datasets[1];
    const lowerDs = chart.data.datasets[2];
    lowerDs.fill = '-1';
    let timeIdx = 0;
    belaqiTimeline.forEach((entry, i) => {
      if (entry.timestamp.getTime() <= this.location.date.getTime()) {
        upperDs.data.push(entry.index);
        lowerDs.data.push(entry.index);
        timeIdx = i;
      } else {
        const dist = timeIdx - i;
        upperDs.data.push(entry.index + FORCAST_UNCERTAINTY_BUFFER_FACTOR * dist);
        lowerDs.data.push(entry.index - FORCAST_UNCERTAINTY_BUFFER_FACTOR * dist);
      }
    });
    chart.update();
  }

  private drawData(ctx: CanvasRenderingContext2D, chart: Chart, belaqiTimeline: BelaqiTimelineEntry[]) {
    const gradientStroke = ctx.createLinearGradient(
      chart.chartArea.left, chart.chartArea.top, chart.chartArea.left, chart.chartArea.bottom
    );
    const colorPalette = belaqiTimeline.map(e => this.belaqiIndex.getColorForIndex(e.index));
    gradientStroke.addColorStop(0.0, this.belaqiIndex.getColorForIndex(10));
    gradientStroke.addColorStop(0.11, this.belaqiIndex.getColorForIndex(9));
    gradientStroke.addColorStop(0.22, this.belaqiIndex.getColorForIndex(8));
    gradientStroke.addColorStop(0.33, this.belaqiIndex.getColorForIndex(7));
    gradientStroke.addColorStop(0.44, this.belaqiIndex.getColorForIndex(6));
    gradientStroke.addColorStop(0.55, this.belaqiIndex.getColorForIndex(5));
    gradientStroke.addColorStop(0.66, this.belaqiIndex.getColorForIndex(4));
    gradientStroke.addColorStop(0.77, this.belaqiIndex.getColorForIndex(3));
    gradientStroke.addColorStop(0.88, this.belaqiIndex.getColorForIndex(2));
    gradientStroke.addColorStop(1.0, this.belaqiIndex.getColorForIndex(1));
    const dataset = chart.data.datasets[0];
    dataset.borderColor = gradientStroke;
    dataset.pointBorderColor = colorPalette;
    dataset.pointBackgroundColor = colorPalette;
    dataset.pointHoverBackgroundColor = colorPalette;
    dataset.pointHoverBorderColor = colorPalette;
    dataset.data = this.createDataArray(belaqiTimeline);
    chart.update();
  }

  private createDataArray(belaqiTimeline: BelaqiTimelineEntry[]): number[] | Chart.ChartPoint[] {
    return belaqiTimeline.map(e => e.index);
  }

  private createLabels(belaqiTimeline: BelaqiTimelineEntry[]): (string | string[])[] {
    return belaqiTimeline.map(e => e.timestamp.getHours().toString());
  }
}
