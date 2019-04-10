import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class SingleChartComponent implements OnChanges {

  @ViewChild('chart') barCanvas;

  @Input()
  public loading: boolean;

  @Input()
  public label: string;

  @Input()
  public timespan: Timespan;

  @Input()
  public data: DataEntry[];

  @Input()
  public location: UserLocation;

  private chart: any;

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.label && this.timespan && this.data && this.location) {
      this.drawChart();
    }
  }

  private drawChart() {
    this.loading = false;
    const canvas = this.barCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      plugins: [{
        resize: c => this.drawData(ctx, c, this.data)
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
            xMin: new Date().setHours(0, 0, 0, 0),
            xMax: new Date(this.timespan.to),
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
              // source: 'data',
              maxRotation: 0,
              // callback: (val, i, values) => {
              //   const hours = this.location.date.getHours() % 6;
              //   if (new Date(values[i].value).getHours() % 6 === hours) {
              //     return val;
              //   } else {
              //     return '';
              //   }
              // }
            }
          }],
        },
        layout: {
          padding: 10
        },
        tooltips: {
          enabled: true,
          callbacks: {
            // label: (tooltip) => {
            //   return ' ' + this.belaqiIndex.getValueForIndex(parseInt(tooltip.yLabel, 10)) +
            //     ' - ' + this.belaqiIndex.getLabelForIndex(parseInt(tooltip.yLabel, 10));
            // },
            // labelColor: (tooltip) => {
            //   return {
            //     borderColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel, 10)),
            //     backgroundColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel, 10))
            //   };
            // },
            title: () => ''
          }
        }
      },
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
          }
        ]
      }
    });
    this.drawData(ctx, this.chart, this.data);
  }

  private drawData(ctx: CanvasRenderingContext2D, chart: Chart, data: DataEntry[]) {
    const dataset = chart.data.datasets[0];
    dataset.pointBackgroundColor = data.map(e => e.color);
    dataset.data = this.createDataArray(data);
    chart.update();
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
