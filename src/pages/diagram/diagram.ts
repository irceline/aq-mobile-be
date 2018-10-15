import { Component, OnInit } from '@angular/core';
import { DefinedTimespan, DefinedTimespanService, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { ModalController, NavController } from 'ionic-angular';

import { ModalLegendComponent } from '../../components/modal-legend/modal-legend';
import { ModalTimespanEditorComponent } from '../../components/modal-timespan-editor/modal-timespan-editor';
import { LocatedTimeseriesService } from '../../providers/timeseries/located-timeseries';
import { TimeseriesService } from '../../providers/timeseries/timeseries';
import { UserTimeseriesService } from '../../providers/timeseries/user-timeseries';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-diagram',
  templateUrl: 'diagram.html'
})
export class DiagramPage implements OnInit {

  public name = 'diagram';

  public loading: boolean;

  public selectedDatasetIds: string[] = [];

  public timespan: Timespan;

  public diagramOptions: D3PlotOptions = {
    hoverable: false,
    showTimeLabel: false
  };

  constructor(
    public tsSrvc: TimeseriesService,
    public userTsSrvc: UserTimeseriesService,
    public locatedTsSrvc: LocatedTimeseriesService,
    private defTimespanSrvc: DefinedTimespanService,
    private modalCtrl: ModalController,
    private nav: NavController
  ) {
    this.timespan = this.defTimespanSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
  }

  public ngOnInit(): void {
    this.locatedTsSrvc.loadNearestSeries();
  }

  public timespanChanged(timespan: Timespan) {
    this.tsSrvc.setTimespan(timespan);
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
    this.nav.push(MapPage);
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
