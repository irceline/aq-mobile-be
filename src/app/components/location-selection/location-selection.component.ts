import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, Output } from '@angular/core';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { DragEndEvent, LatLng, latLng, marker, divIcon, point } from 'leaflet';

@Component({
  selector: 'location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss'],
})
export class LocationSelectionComponent extends CachedMapComponent implements AfterViewInit {

  @Input()
  location: GeoJSON.Point;

  @Output()
  locationChanged: EventEmitter<GeoJSON.Point> = new EventEmitter();

  constructor(
    mapCache: MapCache,
    differs: KeyValueDiffers
  ) {
    super(mapCache, differs);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMap();
      this.drawLocation();
    }, 200);
  }

  protected drawLocation() {
    if (this.location) {
      var icondiv = divIcon({className: 'marker', iconAnchor: point(10,40)});
      const createdMarker = marker(latLng(this.location.coordinates[1], this.location.coordinates[0]), { draggable: true, icon: icondiv });
      createdMarker.on('dragend', (evt: DragEndEvent) => {
        const latlng: LatLng = evt.target.getLatLng();
        this.locationChanged.emit({
          type: 'Point',
          coordinates: [latlng.lng, latlng.lat]
        });
      });
      createdMarker.addTo(this.map);
      this.map.fitBounds(createdMarker.getLatLng().toBounds(10));
    }
  }
}
