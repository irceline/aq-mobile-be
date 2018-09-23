import { Component } from '@angular/core';
import { GeometryMapViewerComponent } from '@helgoland/map';

@Component({
  selector: 'extended-geometry-map-viewer',
  templateUrl: 'extended-geometry-map-viewer.html'
})
export class ExtendedGeometryMapViewerComponent extends GeometryMapViewerComponent {

  public ngAfterViewInit() {
    setTimeout(() => {
      super.ngAfterViewInit()
    }, 100);
  }
}
