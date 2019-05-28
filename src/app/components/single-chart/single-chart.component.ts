import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Timespan } from '@helgoland/core';
import { Chart } from 'chart.js';

import { UserLocation } from '../../services/user-location-list/user-location-list.service';

export interface DataEntry {
  timestamp: number;
  value: number;
  color: string;
}

@Component({
  selector: 'single-chart',
  templateUrl: './single-chart.component.html',
  styleUrls: ['./single-chart.component.scss'],
})
export class SingleChartComponent implements OnChanges, DoCheck {

  @ViewChild('chart') barCanvas;

  @Input()
  public loading: boolean;

  @Input()
  public label: string;

  @Input()
  public timeLabel: string;

  @Input()
  public timespan: Timespan;

  @Input()
  public data: DataEntry[][];

  @Input()
  public location: UserLocation;

  @Input()
  public error: boolean;

  @Output()
  public back: EventEmitter<void> = new EventEmitter();

  @Output()
  public forward: EventEmitter<void> = new EventEmitter();

  public canBack: boolean;
  public canForward: boolean;

  private iterableDiffer: IterableDiffer<{}>;

  private chart: any;

  constructor(
    private iterableDiffers: IterableDiffers
  ) {
    this.iterableDiffer = this.iterableDiffers.find([]).create(null);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.label && this.timespan && this.data && this.location) {
      if (!this.chart) {
        this.drawChart();
      }
      this.checkButton();
    }
  }

  public ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.data);
    if (changes && this.chart) {
      this.updateChart();
    }
  }

  private checkButton() {
    this.canBack = true;
    const now = new Date().getTime();
    if (now > this.timespan.to) {
      this.canForward = true;
    } else {
      this.canForward = false;
    }
  }

  private drawChart() {
    this.loading = false;
    const canvas = this.barCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      plugins: [{
        resize: c => this.drawData(this.data)
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
          annotations: [{
            type: 'box',
            id: 'a-box-1',
            xScaleID: 'x-axis-0',
            xMin: new Date(this.timespan.from),
            xMax: new Date().setHours(0, 0, 0, 0),
            backgroundColor: 'rgba(0,0,0,0.1)',
          }]
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              // max: 10,
              reverse: false,
              display: true
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              parser: 'MM/DD/YYYY HH:mm',
              min: new Date(this.timespan.from),
              max: new Date(this.timespan.to),
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            },
            ticks: {
              maxRotation: 0,
              padding: 5,
              fontSize: 10
            }
          }, {
            type: 'time',
            time: {
              parser: 'MM/DD/YYYY HH:mm',
              min: new Date(this.timespan.from),
              max: new Date(this.timespan.to),
              unit: 'hour',
              displayFormats: {
                hour: 'MMM D'
              }
            },
            ticks: {
              source: 'auto',
              maxRotation: 0,
              padding: -5,
              fontSize: 10,
              callback: function (val, i, values) {
                if (values[i] && values[i].value) {
                  if (new Date(values[i].value).getHours() === 12) {
                    return val;
                  }
                }
              }
            },
            gridLines: {
              drawTicks: false,
              drawBorder: false,
              drawOnChartArea: false
            }
          }],
        },
        layout: {
          padding: 10
        },
        tooltips: {
          enabled: false
        }
      },
      data: {
        datasets: [],
        labels: ['test', 'test']
      }
    });
    this.drawData(this.data);
  }

  private updateChart() {
    // adjust new timeframe
    this.chart.options.scales.xAxes[0].time.min = new Date(this.timespan.from);
    this.chart.options.scales.xAxes[0].time.max = new Date(this.timespan.to);
    this.chart.options.scales.xAxes[1].time.min = new Date(this.timespan.from);
    this.chart.options.scales.xAxes[1].time.max = new Date(this.timespan.to);
    this.drawData(this.data);
  }

  private drawData(data: DataEntry[][]) {
    this.adjustDatasets(data.length);
    data.forEach((v, i) => {
      const dataset = this.chart.data.datasets[i];
      dataset.pointBackgroundColor = v.map(e => e.color);
      dataset.data = this.createDataArray(v);
    });
    this.chart.update();
  }

  private adjustDatasets(length: number) {
    while (this.chart.data.datasets.length > length) {
      this.chart.data.datasets.pop();
    }

    while (this.chart.data.datasets.length < length) {
      this.chart.data.datasets.push({
        pointBorderWidth: 0,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        fill: false,
        cubicInterpolationMode: 'monotone',
        borderWidth: 2,
        data: []
      });
    }
  }

  private createDataArray(data: DataEntry[]): number[] | Chart.ChartPoint[] {
    return data.map(e => {
      return {
        x: e.timestamp,
        y: e.value
      };
    });
  }

}
