import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  KeyValueDiffers,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  DatasetApiInterface,
  ParameterFilter,
  Station,
  StatusIntervalResolverService,
  HelgolandPlatform,
  HelgolandServicesConnector,
  HelgolandTimeseries,
} from '@helgoland/core';
import { MapCache, MapSelectorComponent } from '@helgoland/map';
import { CircleMarker, circleMarker, featureGroup, geoJSON, Layer, markerClusterGroup } from 'leaflet';
import { Subscription } from 'rxjs';

import { getMainPhenomenonForID } from '../../model/phenomenon';
import { BelaqiIndexService } from '../../services/belaqi/belaqi.service';
import { CategorizedValueService } from '../../services/categorized-value/categorized-value.service';
import { IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';

@Component({
  selector: 'customized-station-map-selector',
  templateUrl: './customized-station-map-selector.component.html',
  styleUrls: ['./customized-station-map-selector.component.scss'],
})
export class CustomizedStationMapSelectorComponent extends MapSelectorComponent<HelgolandPlatform> implements OnChanges, AfterViewInit {

  @Input()
  public cluster: boolean;

  @Input()
  public statusIntervals: boolean;

  // @Input()
  // public markerSelectorGenerator: MarkerSelectorGenerator;

  /**
   * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
   */
  @Input()
  public ignoreStatusIntervalIfBeforeDuration = Infinity;

  private markerFeatureGroup: L.FeatureGroup;
  private ongoingTimeseriesSubscriber: Subscription;

  constructor(
    protected statusIntervalResolver: StatusIntervalResolverService,
    protected servicesConnector: HelgolandServicesConnector,
    protected mapCache: MapCache,
    protected differs: KeyValueDiffers,
    protected cd: ChangeDetectorRef,
    protected categorizer: CategorizedValueService,
    protected belaqi: BelaqiIndexService,
    protected ircelineSettings: IrcelineSettingsService
  ) {
    super(mapCache, differs, cd);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map && changes.statusIntervals) { this.drawGeometries(); }
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.createMap();
      this.drawGeometries();
    }, 300);
  }

  protected drawGeometries() {
    this.onContentLoading.emit(true);
    if (this.ongoingTimeseriesSubscriber) { this.ongoingTimeseriesSubscriber.unsubscribe(); }
    if (this.map && this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
    if (this.statusIntervals && this.filter && this.filter.phenomenon) {
      this.createValuedMarkers();
    }
  }

  private createValuedMarkers() {
    const tempFilter: ParameterFilter = {
      phenomenon: this.filter.phenomenon,
      expanded: true
    };
    this.ircelineSettings.getSettings().subscribe(res => {
      this.ongoingTimeseriesSubscriber = this.servicesConnector.getDatasets(this.serviceUrl, tempFilter).subscribe(
        timeseries => {
          this.markerFeatureGroup = featureGroup();
          timeseries.forEach((ts: HelgolandTimeseries) => {
            if ((ts.lastValue.timestamp) > res.lastupdate.getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
              let marker;
              const phenomenon = getMainPhenomenonForID(ts.parameters.phenomenon.id);
              if (phenomenon) {
                const index = this.categorizer.categorize(ts.lastValue.value, phenomenon);
                const color = this.belaqi.getColorForIndex(index);
                if (color) { marker = this.createColoredMarker(ts.platform, color); }
              }
              if (!marker) { marker = this.createDefaultColoredMarker(ts.platform); }
              if (marker) {
                marker.on('click', () => {
                  this.onSelected.emit(ts.platform);
                });
                this.markerFeatureGroup.addLayer(marker);
              }
            }
          });
          if (!this.avoidZoomToSelection) {
            this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
          }
          this.onContentLoading.emit(false);
          if (this.map) { this.markerFeatureGroup.addTo(this.map); }
        },
        error => {
          this.markerFeatureGroup = featureGroup();
          if (this.map) { this.markerFeatureGroup.addTo(this.map); }
        }
      );
    });
  }

  private createColoredMarker(station: HelgolandPlatform, color: string): Layer {
    if (this.markerSelectorGenerator.createFilledMarker) {
      return this.markerSelectorGenerator.createFilledMarker(station, color);
    }
    return this.createFilledMarker(station, color, 10);
  }

  private createDefaultColoredMarker(station: HelgolandPlatform): Layer {
    if (this.markerSelectorGenerator.createDefaultFilledMarker) {
      return this.markerSelectorGenerator.createDefaultFilledMarker(station);
    }
    return this.createFilledMarker(station, '#000', 10);
  }

  private createFilledMarker(station: HelgolandPlatform, color: string, radius: number): Layer {
    let geometry: Layer;
    if (station.geometry.type === 'Point') {
      const point = station.geometry as GeoJSON.Point;
      geometry = circleMarker([point.coordinates[1], point.coordinates[0]], {
        color: '#000',
        fillColor: color,
        fillOpacity: 0.8,
        radius: this.calculateRadius(),
        weight: 2
      });
      this.map.on('zoomend', () => {
        (geometry as CircleMarker).setRadius(this.calculateRadius());
      });
    } else {
      geometry = geoJSON(station.geometry, {
        style: (feature) => {
          return {
            color: '#000',
            fillColor: color,
            fillOpacity: 0.8,
            weight: 2
          };
        }
      });
    }
    if (geometry) {
      geometry.on('click', () => {
        this.onSelected.emit(station);
      });
      return geometry;
    }
  }

  private calculateRadius(): number {
    const currentZoom = this.map.getZoom();
    if (currentZoom <= 7) { return 6; }
    return currentZoom;
  }

  private createStationGeometries() {
    this.servicesConnector.getPlatforms(this.serviceUrl, this.filter)
      .subscribe((res) => {
        if (this.cluster) {
          this.markerFeatureGroup = markerClusterGroup({ animate: true });
        } else {
          this.markerFeatureGroup = featureGroup();
        }
        if (res instanceof Array && res.length > 0) {
          res.forEach((entry) => {
            const marker = this.createDefaultGeometry(entry);
            if (marker) { this.markerFeatureGroup.addLayer(marker); }
          });
          this.markerFeatureGroup.addTo(this.map);
          this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
        } else {
          this.onNoResultsFound.emit(true);
        }
        this.map.invalidateSize();
        this.onContentLoading.emit(false);
      });
  }

  private createDefaultGeometry(platform: HelgolandPlatform) {
    if (platform.geometry) {
      const geometry = geoJSON(platform.geometry);
      geometry.on('click', () => this.onSelected.emit(platform));
      return geometry;
    } else {
      console.error(platform.id + ' has no geometry');
    }
  }

}

// export interface MarkerSelectorGenerator {
//   createFilledMarker?(station: Station, color: string): Layer;
//   createDefaultFilledMarker?(station: Station): Layer;
// }
