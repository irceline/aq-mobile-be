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
  HasLoadableContent,
  Mixin,
  ParameterFilter,
  Station,
  StatusIntervalResolverService,
  Timeseries,
} from '@helgoland/core';
import { MapCache, MapSelectorComponent } from '@helgoland/map';
import { CircleMarker, circleMarker, featureGroup, geoJSON, Layer, markerClusterGroup } from 'leaflet';

import { getMainPhenomenonForID } from '../../model/phenomenon';
import { BelaqiIndexProvider } from '../../providers/belaqi/belaqi';
import { CategorizeValueToIndexProvider } from '../../providers/categorize-value-to-index/categorize-value-to-index';

@Component({
  selector: 'customized-station-map-selector',
  templateUrl: 'customized-station-map-selector.html'
})
@Mixin([HasLoadableContent])
export class CustomizedStationMapSelectorComponent extends MapSelectorComponent<Station> implements OnChanges, AfterViewInit {

  @Input()
  public cluster: boolean;

  @Input()
  public statusIntervals: boolean;

  @Input()
  public markerSelectorGenerator: MarkerSelectorGenerator;

  /**
   * Ignores all Statusintervals where the timestamp is before a given duration in milliseconds and draws instead the default marker.
   */
  @Input()
  public ignoreStatusIntervalIfBeforeDuration = Infinity;

  private markerFeatureGroup: L.FeatureGroup;

  constructor(
    protected statusIntervalResolver: StatusIntervalResolverService,
    protected apiInterface: DatasetApiInterface,
    protected mapCache: MapCache,
    protected differs: KeyValueDiffers,
    protected cd: ChangeDetectorRef,
    protected categorizer: CategorizeValueToIndexProvider,
    protected belaqi: BelaqiIndexProvider
  ) {
    super(mapCache, differs, cd);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map && changes.statusIntervals) { this.drawGeometries(); }
  }

  public ngAfterViewInit() {
    this.createMap();
  }

  protected drawGeometries() {
    this.isContentLoading(true);
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
    this.apiInterface.getTimeseries(this.serviceUrl, tempFilter).subscribe((timeseries: Timeseries[]) => {
      this.markerFeatureGroup = featureGroup();
      timeseries.forEach(ts => {
        if ((ts.lastValue.timestamp) > new Date().getTime() - this.ignoreStatusIntervalIfBeforeDuration) {
          const phenomenon = getMainPhenomenonForID(ts.parameters.phenomenon.id);
          const index = this.categorizer.categorize(ts.lastValue.value, phenomenon);
          const color = this.belaqi.getColorForIndex(index);
          let marker;
          if (color) { marker = this.createColoredMarker(ts.station, color); }
          if (!marker) { marker = this.createDefaultColoredMarker(ts.station); }
          if (marker) {
            marker.on('click', () => {
              this.onSelected.emit(ts.station);
            });
            this.markerFeatureGroup.addLayer(marker);
          }
        }
      });

      this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
      if (this.map) { this.map.invalidateSize(); }
      this.isContentLoading(false);
      if (this.map) { this.markerFeatureGroup.addTo(this.map); }
    });
  }

  private createColoredMarker(station: Station, color: string): Layer {
    if (this.markerSelectorGenerator.createFilledMarker) {
      return this.markerSelectorGenerator.createFilledMarker(station, color);
    }
    return this.createFilledMarker(station, color, 10);
  }

  private createDefaultColoredMarker(station: Station): Layer {
    if (this.markerSelectorGenerator.createDefaultFilledMarker) {
      return this.markerSelectorGenerator.createDefaultFilledMarker(station);
    }
    return this.createFilledMarker(station, '#000', 10);
  }

  private createFilledMarker(station: Station, color: string, radius: number): Layer {
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
      })
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
    if (currentZoom <= 7) return 6;
    return currentZoom;
  }

  private createStationGeometries() {
    this.apiInterface.getStations(this.serviceUrl, this.filter)
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
        this.isContentLoading(false);
      });
  }

  private createDefaultGeometry(station: Station) {
    if (station.geometry) {
      const geometry = geoJSON(station.geometry);
      geometry.on('click', () => this.onSelected.emit(station));
      return geometry;
    } else {
      console.error(station.id + ' has no geometry');
    }
  }

}

export interface MarkerSelectorGenerator {
  createFilledMarker?(station: Station, color: string): Layer;
  createDefaultFilledMarker?(station: Station): Layer;
}
