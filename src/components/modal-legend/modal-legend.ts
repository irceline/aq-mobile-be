import { Component, Renderer } from '@angular/core';
import { DatasetOptions, Time, Timespan } from '@helgoland/core';
import { ModalController, ViewController } from 'ionic-angular';
import { first } from 'rxjs/operators';

import { TimeseriesService } from '../../providers/timeseries/timeseries';
import { UserTimeseriesService } from '../../providers/timeseries/user-timeseries';
import { ModalGeometryViewerComponent } from '../modal-geometry-viewer/modal-geometry-viewer';
import { ModalOptionsEditorComponent } from '../modal-options-editor/modal-options-editor';

@Component({
  selector: 'modal-legend',
  templateUrl: 'modal-legend.html'
})
export class ModalLegendComponent {

  public datasetIds: string[];

  public datasetOptions: Map<string, DatasetOptions>;

  constructor(
    private userTimeseriesSrvc: UserTimeseriesService,
    private tsSrvc: TimeseriesService,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private timeSrvc: Time,
    private renderer: Renderer
  ) {
    this.datasetIds = this.userTimeseriesSrvc.datasetIds;
    this.datasetOptions = this.userTimeseriesSrvc.datasetOptions;
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'modal-legend', true);
  }

  public isSelected(id: string): boolean {
    return false;
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public deleteTimeseries(id: string) {
    this.userTimeseriesSrvc.removeDataset(id);
    if (this.userTimeseriesSrvc.datasetIds.length === 0) { this.dismiss(); }
  }

  public updateOptions(options: DatasetOptions, internalId: string) {
    this.userTimeseriesSrvc.updateDatasetOptions(options, internalId);
    this.dismiss();
  }

  public showGeometry(geometry: GeoJSON.GeoJsonObject) {
    this.modalCtrl.create(ModalGeometryViewerComponent, {
      geometry
    }).present();
  }

  public editOption(options: DatasetOptions) {
    const modalRef = this.modalCtrl.create(ModalOptionsEditorComponent, {
      options
    })
    modalRef.onDidDismiss((option: DatasetOptions) => {
      if (option) {
        this.userTimeseriesSrvc.updateDatasetOptions(option, option.internalId);
      }
    });
    modalRef.present();
  }

  public jumpToDate(date: Date) {
    this.tsSrvc.getTimespan()
      .pipe(first<Timespan>((ts, i, s) => {
        const timespan = this.timeSrvc.centerTimespan(ts, date);
        this.viewCtrl.dismiss(timespan);
        return true;
      })).subscribe();
  }

}
