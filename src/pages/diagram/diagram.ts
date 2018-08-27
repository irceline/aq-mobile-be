import { Component } from '@angular/core';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { ModalController, NavController } from 'ionic-angular';

import { ModalLegendComponent } from '../../components/modal-legend/modal-legend';
import { ModalTimespanEditorComponent } from '../../components/modal-timespan-editor/modal-timespan-editor';
import { TimeseriesService } from '../../providers/timeseries/timeseries.service';
import { CombinedMapPage } from '../combined-map/combined-map';

@Component({
  selector: 'page-diagram',
  templateUrl: 'diagram.html'
})
export class DiagramPage {

  public loading: boolean;
  public datasetIds: string[];

  public selectedDatasetIds: string[] = [];

  public datasetOptions: Map<string, DatasetOptions> = new Map();

  public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());

  public diagramOptions: D3PlotOptions = {
    hoverable: false
  };

  constructor(
    private timeseriesSrvc: TimeseriesService,
    private modalCtrl: ModalController,
    private nav: NavController
  ) {
    this.datasetIds = this.timeseriesSrvc.datasetIds;
    this.datasetOptions = this.timeseriesSrvc.datasetOptions;
    this.timeseriesSrvc.getTimespan().subscribe(timespan => this.timespan = timespan);
  }

  public timespanChanged(timespan: Timespan) {
    this.timeseriesSrvc.setTimespan(timespan);
    this.timespan = timespan;
  }

  public openTimeSettings() {
    const modal = this.modalCtrl.create(ModalTimespanEditorComponent, {
      timespan: this.timespan
    });
    modal.onDidDismiss(timespan => {
      if (timespan instanceof Timespan) this.timespanChanged(timespan);
    });
    modal.present();
  }

  public openLegend() {
    const modal = this.modalCtrl.create(ModalLegendComponent, {}, { showBackdrop: true, enableBackdropDismiss: true });
    modal.onDidDismiss(data => {
      if (data instanceof Timespan) this.timespanChanged(data);
    })
    modal.present();
  }

  public openMapSelection() {
    this.nav.push(CombinedMapPage);
  }

  public onSelectedDataset(id: string, selection: boolean) {
    const idx = this.selectedDatasetIds.indexOf(id);
    if (selection) {
      if (idx === -1) {
        this.selectedDatasetIds.push(id);
      }
    } else {
      if (idx !== -1) {
        this.selectedDatasetIds.splice(idx, 1);
      }
    }
  }

  public isSelected(id: string) {
    return this.selectedDatasetIds.indexOf(id) > -1;
  }

}
