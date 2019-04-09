import { Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { DatasetApiInterface, DefinedTimespan, DefinedTimespanService, Timeseries, Timespan } from '@helgoland/core';
import { IonSlides } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { getIDForMainPhenomenon, MainPhenomenon } from '../../model/phenomenon';
import { BelaqiIndexService } from '../../services/belaqi/belaqi.service';
import { CategorizedValueService } from '../../services/categorized-value/categorized-value.service';
import { IrcelineSettings, IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';
import { LocateService, LocationStatus } from '../../services/locate/locate.service';
import { NearestTimeseriesService } from '../../services/nearest-timeseries/nearest-timeseries.service';
import { NetworkAlertService } from '../../services/network-alert/network-alert.service';
import { RefreshHandler } from '../../services/refresh/refresh.service';
import { UserLocation, UserLocationListService } from '../../services/user-location-list/user-location-list.service';
import { DataEntry } from '../single-chart/single-chart.component';
import { HeaderContent } from '../slider-header/slider-header.component';

@Component({
  selector: 'belaqi-diagram-slider',
  templateUrl: './belaqi-diagram-slider.component.html',
  styleUrls: ['./belaqi-diagram-slider.component.scss'],
})
export class BelaqiDiagramSliderComponent implements OnDestroy {

  @ViewChild('slider')
  slider: IonSlides;

  @Output()
  public headerContent: EventEmitter<HeaderContent> = new EventEmitter();

  public sliderOptions = { zoom: false };

  public diagramViews: DiagramView[];

  public timespan: Timespan;

  private loadingLocations = false;
  public currentLocationError: string;

  constructor(
    private ircelineSettings: IrcelineSettingsService,
    private userLocationListService: UserLocationListService,
    private nearestStation: NearestTimeseriesService,
    private locate: LocateService,
    private refreshHandler: RefreshHandler,
    private networkAlert: NetworkAlertService,
    private api: DatasetApiInterface,
    private defTimespanSrvc: DefinedTimespanService,
    private categorizeValSrvc: CategorizedValueService,
    private belaqiSrvc: BelaqiIndexService
  ) {
    this.timespan = this.defTimespanSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
    this.locate.getLocationStatusAsObservable().subscribe(locationStatus => {
      if (locationStatus !== LocationStatus.DENIED) {
        this.loadBelaqis(false);
      }
    });

    this.userLocationListService.locationsChanged.subscribe(() => this.loadBelaqis(false));
    this.networkAlert.onConnected.subscribe(() => this.loadBelaqis(false));
  }

  public ngOnDestroy(): void {
    if (this.refreshHandler) { this.refreshHandler.onRefresh.unsubscribe(); }
    if (this.userLocationListService) { this.userLocationListService.locationsChanged.unsubscribe(); }
    if (this.networkAlert) { this.networkAlert.onConnected.unsubscribe(); }
  }

  private async loadBelaqis(reload: boolean) {
    if (this.userLocationListService.hasLocations() && !this.loadingLocations) {
      this.currentLocationError = null;
      this.loadingLocations = true;
      this.ircelineSettings.getSettings(reload).subscribe(
        ircelineSettings => {
          this.diagramViews = [];
          this.userLocationListService.getVisibleUserLocations().forEach((loc, i) => {
            // Init MapView
            this.diagramViews[i] = new DiagramView(
              this.nearestStation,
              this.api,
              this.timespan,
              this.categorizeValSrvc,
              this.belaqiSrvc
            );
            // Set MapView Location
            if (loc.type !== 'current') {
              this.setLocation(loc, i, ircelineSettings);
            } else {
              this.diagramViews[i].location = {
                type: 'current'
              };
              this.userLocationListService.determineCurrentLocation().subscribe(
                currentLoc => {
                  this.setLocation(currentLoc, i, ircelineSettings);
                  this.setHeader(0);
                },
                error => {
                  this.currentLocationError = error || true;
                }
              );
            }
          });
          setTimeout(() => {
            if (this.slider) {
              this.slider.update();
              this.slider.slideTo(0);
            }
            this.setHeader(0);
          }, 300);
          this.loadingLocations = false;
        },
        _error => {
          this.loadingLocations = false;
        });
    }
  }

  private setLocation(loc: UserLocation, i: number, ircelineSettings: IrcelineSettings) {
    this.diagramViews[i].location = {
      label: loc.label,
      date: ircelineSettings.lastupdate,
      type: loc.type,
      latitude: loc.latitude,
      longitude: loc.longitude
    };
    this.diagramViews[i].init();
  }

  private setHeader(idx: number): any {
    if (idx <= this.diagramViews.length - 1) {
      this.headerContent.emit({
        label: this.diagramViews[idx].location.label,
        date: this.diagramViews[idx].location.date,
        current: this.diagramViews[idx].location.type === 'current'
      });
    }
  }

  public slideChanged() {
    this.slider.getActiveIndex().then(idx => this.setHeader(idx));
  }

}

class DiagramView {

  public location: UserLocation;

  public loadingNO2: boolean;
  public dataNO2: DataEntry[];
  public labelNO2: string;

  public loadingBC: boolean;
  public dataBC: DataEntry[];
  public labelBC: string;

  constructor(
    private nearestTimeseries: NearestTimeseriesService,
    private api: DatasetApiInterface,
    private timespan: Timespan,
    private categorizeValSrvc: CategorizedValueService,
    private belaqiSrvc: BelaqiIndexService
  ) { }

  public init() {
    this.determineNextStationNO2();
  }

  private determineNextStationNO2() {
    this.determineNextStation(
      MainPhenomenon.NO2,
      (series) => this.labelNO2 = `${series.parameters.phenomenon.label} @ ${series.station.properties.label}`,
      (loading) => this.loadingNO2 = loading,
      (value) => this.belaqiSrvc.getColorForIndex(this.categorizeValSrvc.categorize(value, MainPhenomenon.NO2)),
      (data) => this.dataNO2 = data
    );

  }

  private determineNextStation(
    phenomenon: MainPhenomenon,
    setLabel: (series: Timeseries) => void,
    setLoading: (loading: boolean) => void,
    setColor: (value: number) => string,
    setData: (data: DataEntry[]) => void
  ) {
    setLoading(true);
    this.nearestTimeseries.determineNextTimeseries(
      this.location.latitude, this.location.longitude,
      getIDForMainPhenomenon(phenomenon)
    ).subscribe(nearest => {
      setLabel(nearest.series);
      this.api.getTsData<{
        timestamp: number;
        value: number;
      }>(nearest.series.id, nearest.series.url, this.timespan)
        .pipe(map(res => {
          return res.values.map(e => {
            return {
              timestamp: e.timestamp,
              value: e.value,
              color: setColor(e.value)
            } as DataEntry;
          });
        }))
        .subscribe(res => setData(res));
    });
  }
}
