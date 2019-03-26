import 'chartjs-plugin-annotation';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Chart, ChartOptions } from 'chart.js';
import moment, { Moment } from 'moment';

import { BelaqiIndexService, BelaqiTimelineEntry } from '../../services/belaqi/belaqi.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { BelaqiChartInformationComponent } from './belaqi-chart-information.component';

interface ExpandedChartOptions extends ChartOptions {
  annotation: any;
}

interface Timeframe {
  start: Moment;
  end: Moment;
}

const FORCAST_UNCERTAINTY_BUFFER_FACTOR = 0.1;
const MAX_UNCERTAINTY_BUFFER = 2;
const INITIAL_HOURS_BUFFER = 11;
const HOUR_STEPS = 11;

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

  public showPrevButton: boolean;
  public showNextButton: boolean;

  private timespan: Timeframe;
  private chart: any;
  private timeline: BelaqiTimelineEntry[];

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

  private handleError(error) {
    console.warn(error);
    this.error = true;
    this.loading = false;
    this.ready.emit();
  }

  public presentPopover(myEvent) {
    this.popoverCtrl.create({
      component: BelaqiChartInformationComponent,
      event: myEvent
    }).then(popover => popover.present());
  }

  public previousTime() {
    this.timespan.start = moment(this.timespan.start).subtract(HOUR_STEPS, 'hours');
    this.timespan.end = moment(this.timespan.end).subtract(HOUR_STEPS, 'hours');
    this.updateTimespan();
  }

  public nextTime() {
    this.timespan.start = moment(this.timespan.start).add(HOUR_STEPS, 'hours');
    this.timespan.end = moment(this.timespan.end).add(HOUR_STEPS, 'hours');
    this.updateTimespan();
  }

  private updateTimespan() {
    this.checkButtons();
    this.chart.options.scales.xAxes[0].time.min = this.timespan.start.toDate();
    this.chart.options.scales.xAxes[0].time.max = this.timespan.end.toDate();
    this.chart.update();
  }

  private checkButtons() {
    this.showPrevButton = this.timespan.start.isAfter(moment(this.timeline[0].timestamp));
    this.showNextButton = this.timespan.end.isBefore(moment(this.timeline[this.timeline.length - 1].timestamp));
  }

  private initTimespan() {
    this.timespan = {
      start: moment(this.location.date).subtract(INITIAL_HOURS_BUFFER, 'hours'),
      end: moment(this.location.date).add(INITIAL_HOURS_BUFFER, 'hours')
    };
    this.checkButtons();
  }

  private drawChart(belaqiTimeline: BelaqiTimelineEntry[]) {
    this.timeline = belaqiTimeline;
    this.initTimespan();
    this.loading = false;
    const canvas = this.barCanvas.nativeElement as HTMLCanvasElement;
    if (canvas.clientHeight <= 0) { return; }
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      plugins: [{
        resize: c => this.drawData(ctx, c, belaqiTimeline)
      }],
      options: {
        legend: {
          display: false
        },
        animation: {
          duration: 300
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
            value: this.location.date,
            borderColor: '#91c0d5',
            borderWidth: 3,
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
          }],
          xAxes: [{
            type: 'time',
            time: {
              parser: 'MM/DD/YYYY HH:mm',
              min: this.timespan.start.toDate(),
              max: this.timespan.end.toDate(),
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            },
            ticks: {
              source: 'data',
              maxRotation: 0,
              callback: (val, i, values) => {
                const hours = this.location.date.getHours() % 6;
                if (new Date(values[i].value).getHours() % 6 === hours) {
                  return val;
                } else {
                  return '';
                }
              }
            }
          }],
        },
        layout: {
          padding: 10
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: (tooltip) => {
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
    this.drawData(ctx, this.chart, belaqiTimeline);
    this.drawBuffer(this.chart, belaqiTimeline);
    this.ready.emit();
  }

  private drawBuffer(chart: Chart, belaqiTimeline: BelaqiTimelineEntry[]) {
    const upperDs = chart.data.datasets[1];
    const lowerDs = chart.data.datasets[2];
    lowerDs.fill = '-1';
    let timeIdx = 0;
    belaqiTimeline.forEach((entry, i) => {
      if (entry.timestamp.getTime() <= this.location.date.getTime()) {
        const val = { x: entry.timestamp, y: entry.index };
        upperDs.data.push(val);
        lowerDs.data.push(val);
        timeIdx = i;
      } else {
        let factor = FORCAST_UNCERTAINTY_BUFFER_FACTOR * (i - timeIdx);
        if (factor > MAX_UNCERTAINTY_BUFFER) { factor = MAX_UNCERTAINTY_BUFFER; }
        upperDs.data.push({ x: entry.timestamp, y: entry.index + factor });
        lowerDs.data.push({ x: entry.timestamp, y: entry.index - factor });
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
    return belaqiTimeline.map(e => {
      return {
        x: e.timestamp,
        y: e.index
      };
    });
  }

}
