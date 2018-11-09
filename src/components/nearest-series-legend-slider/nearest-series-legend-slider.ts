import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ColorService, DatasetOptions } from '@helgoland/core';
import { Slides, Toggle } from 'ionic-angular';

import { NearestTimeseriesManagerProvider } from '../../providers/nearest-timeseries-manager/nearest-timeseries-manager';
import { LocatedTimeseriesService } from '../../providers/timeseries/located-timeseries';
import { UserLocationListProvider } from '../../providers/user-location-list/user-location-list';

interface LegendGroup {
  label: string;
  datasets: LegendGroupEntry[];
}

interface LegendGroupEntry {
  id: string;
  option: DatasetOptions
}

@Component({
  selector: 'nearest-series-legend-slider',
  templateUrl: 'nearest-series-legend-slider.html'
})
export class NearestSeriesLegendSliderComponent implements AfterViewInit {

  @ViewChild('slider')
  slider: Slides;

  public legendGroups: LegendGroup[] = [];

  constructor(
    private userLocations: UserLocationListProvider,
    private locatedTsSrvc: LocatedTimeseriesService,
    private color: ColorService,
    private nearestTimeseriesManager: NearestTimeseriesManagerProvider
  ) {
    this.userLocations.getAllLocations().subscribe(locations => {
      locations.forEach((location, idx) => {
        const series: LegendGroupEntry[] = [];
        this.nearestTimeseriesManager
          .getNearestTimeseries(location)
          .forEach(e => series.push({ id: e, option: this.createDatasetOption(e) }));
        this.legendGroups[idx] = {
          label: location.label,
          datasets: series
        };
      });
    });
  }

  public ngAfterViewInit(): void {
    this.setCurrentIndex();
  }

  public slideChanged() {
    let idx = this.slider.getActiveIndex();
    this.locatedTsSrvc.setSelectedIndex(idx);
    this.locatedTsSrvc.removeAllDatasets();
    this.legendGroups[idx].datasets.forEach(e => this.locatedTsSrvc.addDataset(e.id, e.option));
  }

  public showSeriesSelectionChanged(toggle: Toggle) {
    this.locatedTsSrvc.setShowSeries(toggle.checked);
    if (this.locatedTsSrvc.getShowSeries()) {
      const idx = this.slider.getActiveIndex();
      this.legendGroups[idx].datasets.forEach(e => this.locatedTsSrvc.addDataset(e.id, e.option));
    } else {
      this.locatedTsSrvc.removeAllDatasets();
    }
  }

  private setCurrentIndex() {
    const interval = window.setInterval(() => {
      if (this.slider && this.slider._slides && this.slider._slides.length === this.legendGroups.length) {
        this.slider.update();
        this.slider.slideTo(this.locatedTsSrvc.getSelectedIndex());
        console.log('disabled');
        window.clearInterval(interval);
      }
    }, 10);
  }

  private createDatasetOption(id: string): DatasetOptions {
    if (this.locatedTsSrvc.datasetOptions.has(id)) {
      return this.locatedTsSrvc.datasetOptions.get(id);
    }
    const options = new DatasetOptions(id, this.color.getColor());
    options.pointRadius = 2;
    options.generalize = false;
    options.zeroBasedYAxis = true;
    return options;
  }

}
