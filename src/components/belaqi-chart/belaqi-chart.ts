import 'chartjs-plugin-annotation';

import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';

import { BelaqiIndexProvider, BelaqiTimelineEntry } from '../../providers/belaqi/belaqi';
import { BelaqiLocation } from '../belaqi-user-location-slider/belaqi-user-location-slider';

interface ExpandedChartOptions extends ChartOptions {
  annotation: any;
}

@Component({
  selector: 'belaqi-chart',
  templateUrl: 'belaqi-chart.html'
})
export class BelaqiChartComponent implements OnChanges {

  @ViewChild('testCanvas') barCanvas;

  @Input()
  public location: BelaqiLocation;

  constructor(
    private belaqiIndex: BelaqiIndexProvider
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.location && this.location) {
      this.belaqiIndex.getTimeline(this.location.latitude, this.location.longitude, this.location.date)
      .subscribe(res => this.drawChart(res))
    }
  }

  private drawChart(belaqiTimeline: BelaqiTimelineEntry[]) {
    const canvas = this.barCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      type: 'line',
      plugins: [{
        resize: (chart: Chart) => this.drawData(ctx, chart, belaqiTimeline)
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
            borderColor: '#488aff',
            borderWidth: 2,
          }]
        },
        scales: {
          yAxes: [{
            ticks: {
              min: 1,
              max: 10,
              reverse: false
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
              return this.belaqiIndex.getLabelForIndex(parseInt(tooltip.yLabel));
            },
            labelColor: (tooltip) => {
              return {
                borderColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel)),
                backgroundColor: this.belaqiIndex.getColorForIndex(parseInt(tooltip.yLabel))
              }
            },
            title: () => ''
          }
        }
      } as ExpandedChartOptions,
      data: {
        labels: this.createLabels(belaqiTimeline),
        datasets: [
          {
            pointBorderWidth: 8,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: false,
            cubicInterpolationMode: 'monotone',
            borderWidth: 4,
            data: []
          }
        ]
      }
    });
    this.drawData(ctx, chart, belaqiTimeline);
  }


  private drawData(ctx: CanvasRenderingContext2D, chart: Chart, belaqiTimeline: BelaqiTimelineEntry[]) {
    const gradientStroke = ctx.createLinearGradient(chart.chartArea.left, chart.chartArea.top, chart.chartArea.left, chart.chartArea.bottom);
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
    dataset.pointBorderColor = gradientStroke;
    dataset.pointBackgroundColor = gradientStroke;
    dataset.pointHoverBackgroundColor = gradientStroke;
    dataset.pointHoverBorderColor = gradientStroke;
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
