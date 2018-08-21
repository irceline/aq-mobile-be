import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { Geoposition } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

import { BelaqiIndexProvider, BelaqiTimeline } from '../../providers/belaqi/belaqi';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { LocateProvider } from '../../providers/locate/locate';

@Component({
  selector: 'belaqi-chart',
  templateUrl: 'belaqi-chart.html'
})
export class BelaqiChartComponent implements AfterContentInit {

  @ViewChild('testCanvas') barCanvas;

  public geolocationEnabled: boolean;

  constructor(
    private belaqiIndex: BelaqiIndexProvider,
    private locate: LocateProvider,
    private ircelineSettings: IrcelineSettingsProvider,
    private translate: TranslateService
  ) { }

  ngAfterContentInit(): void {
    this.locate.getLocationStateEnabled().subscribe(res => this.geolocationEnabled = res);

    this.locate.getGeoposition().subscribe(res => this.loadBelaqiTimeline(res));
  }

  private loadBelaqiTimeline(position: Geoposition) {
    this.ircelineSettings.getSettings(false).subscribe(settings => {
      this.belaqiIndex.getTimeline(position.coords.latitude, position.coords.longitude, settings.lastupdate)
        .subscribe(res => this.drawChart(res))
    });
  }

  private drawChart(belaqiTimeline: BelaqiTimeline) {
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
      },
      data: {
        labels: this.createLabels(),
        datasets: [
          {
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: false,
            borderWidth: 4,
            data: []
          }
        ]
      }
    });
    this.drawData(ctx, chart, belaqiTimeline);
  }


  private drawData(ctx: CanvasRenderingContext2D, chart: Chart, belaqiTimeline: BelaqiTimeline) {
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

  private createDataArray(belaqiTimeline: BelaqiTimeline): number[] | Chart.ChartPoint[] {
    return [
      belaqiTimeline.preSixHour,
      belaqiTimeline.preFiveHour,
      belaqiTimeline.preFourHour,
      belaqiTimeline.preThreeHour,
      belaqiTimeline.preTwoHour,
      belaqiTimeline.preOneHour,
      belaqiTimeline.now,
      belaqiTimeline.tomorrow,
      belaqiTimeline.todayPlusTwo,
      belaqiTimeline.todayPlusThree
    ];
  }

  private createLabels(): (string | string[])[] {
    return [
      this.translate.instant('belaqi-chart.xaxis.pre6h'),
      this.translate.instant('belaqi-chart.xaxis.pre5h'),
      this.translate.instant('belaqi-chart.xaxis.pre4h'),
      this.translate.instant('belaqi-chart.xaxis.pre3h'),
      this.translate.instant('belaqi-chart.xaxis.pre2h'),
      this.translate.instant('belaqi-chart.xaxis.pre1h'),
      this.translate.instant('belaqi-chart.xaxis.now'),
      this.translate.instant('belaqi-chart.xaxis.tomorrow'),
      this.translate.instant('belaqi-chart.xaxis.todayPlusTwo'),
      this.translate.instant('belaqi-chart.xaxis.todayPlusThree')
    ];
  }
}
