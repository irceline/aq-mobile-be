import { Component } from '@angular/core';
import { DatasetOptions, Time, Timespan } from '@helgoland/core';
import { ModalController, ViewController } from 'ionic-angular';
import { first } from 'rxjs/operators';

import { TimeseriesService } from '../../providers/timeseries/timeseries.service';
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
    private timeseriesSrvc: TimeseriesService,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private timeSrvc: Time
  ) {
    this.datasetIds = this.timeseriesSrvc.datasetIds;
    this.datasetOptions = this.timeseriesSrvc.datasetOptions;
  }

  public isSelected(id: string): boolean {
    return false;
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public deleteTimeseries(id: string) {
    this.timeseriesSrvc.removeDataset(id);
  }

  public updateOptions(options: DatasetOptions, internalId: string) {
    this.timeseriesSrvc.updateDatasetOptions(options, internalId);
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
        this.timeseriesSrvc.updateDatasetOptions(option, option.internalId);
        this.dismiss();
      }
    });
    modalRef.present();
  }

  public jumpToDate(date: Date) {
    this.timeseriesSrvc.getTimespan()
      .pipe(first<Timespan>((ts, i, s) => {
        const timespan = this.timeSrvc.centerTimespan(ts, date);
        this.viewCtrl.dismiss(timespan);
        return true;
      })).subscribe();
  }

}
