import { AfterViewInit, Component } from '@angular/core';
import { GeometryMapViewerComponent } from '@helgoland/map';

@Component({
  selector: 'extended-geometry-map-viewer',
  templateUrl: './extended-geometry-map-viewer.component.html',
  styleUrls: ['./extended-geometry-map-viewer.component.scss'],
})
export class ExtendedGeometryMapViewerComponent extends GeometryMapViewerComponent implements AfterViewInit {

  public ngAfterViewInit() {
    setTimeout(() => {
      super.ngAfterViewInit();
    }, 200);
  }

}
