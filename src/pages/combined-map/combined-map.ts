import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { DatasetApiInterface, ParameterFilter, Phenomenon, Platform, SettingsService } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions, MapCache } from '@helgoland/map';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import L from 'leaflet';

import { ModalPhenomenonSelectorComponent } from '../../components/modal-phenomenon-selector/modal-phenomenon-selector';
import { StationSelectorComponent } from '../../components/station-selector/station-selector';
import { IrcelineSettingsProvider } from '../../providers/irceline-settings/irceline-settings';
import { MobileSettings } from '../../providers/settings/settings';
import { DiagramPage } from '../diagram/diagram';

const phenomenonMapping = [
  {
    id: '8',
    label: 'NO2'
  }, {
    id: '7',
    label: 'O3'
  }, {
    id: '5',
    label: 'PM10'
  }, {
    id: '6001',
    label: 'PM25'
  }, {
    id: '391',
    label: 'BC'
  }
]

@Component({
  selector: 'page-combined-map',
  templateUrl: 'combined-map.html',
})
export class CombinedMapPage implements AfterViewInit {

  public map: L.Map;
  public geoSearchOptions: GeoSearchOptions;
  public phenomenonLabel: string = 'NO2';
  public time: string = 'today';
  public selectedOtherPhenom: string;

  public providerUrl: string;
  public loading: boolean;
  public phenomenonFilter: ParameterFilter;
  public avoidZoomToSelection = true;
  public zoomControlOptions: L.Control.ZoomOptions = {};
  public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
  public fitBounds: L.LatLngBoundsExpression;
  public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft', hideSingleBase: true };
  public clusterStations: boolean;
  public selectedPhenomenon: Phenomenon;

  constructor(
    protected navCtrl: NavController,
    protected settingsSrvc: SettingsService<MobileSettings>,
    protected navParams: NavParams,
    protected mapCache: MapCache,
    protected modalCtrl: ModalController,
    protected ircelineSettings: IrcelineSettingsProvider,
    protected api: DatasetApiInterface,
    protected cdr: ChangeDetectorRef
  ) {
    const settings = this.settingsSrvc.getSettings();
    this.providerUrl = settings.datasetApis[0].url;
    this.clusterStations = settings.clusterStationsOnMap;
    this.fitBounds = settings.defaultBbox;
    this.geoSearchOptions = { countrycodes: settings.geoSearchContryCodes };

    if (this.navParams.get('phenomenonId')) {
      this.getPhenomenonFromAPI(this.navParams.get('phenomenonId'));
    } else {
      this.onPhenomenonChange();
    }
  }

  public ngAfterViewInit(): void { }

  public onPhenomenonChange(): void {
    const phenID = this.getPhenomenonID(this.phenomenonLabel);
    if (phenID) { this.getPhenomenonFromAPI(phenID) }
    this.selectedOtherPhenom = '';
  }

  private getPhenomenonID(label: string): string {
    const phen = phenomenonMapping.find(e => label === e.label);
    if (phen) return phen.id;
  }

  private getPhenomenonLabel(id: string): string {
    const phen = phenomenonMapping.find(e => id === e.id);
    if (phen) return phen.label;
  }

  public onTimeChange(): void { }

  public openOtherPhenomena() {
    const modal = this.modalCtrl.create(ModalPhenomenonSelectorComponent, {
      providerUrl: this.providerUrl,
      selectedPhenomenonId: this.selectedPhenomenon ? this.selectedPhenomenon.id : null,
      hiddenPhenomenonIDs: phenomenonMapping.map(e => e.id)
    })
    modal._component
    modal.present();
    modal.onDidDismiss((selectedPhenomenon: Phenomenon) => {
      if (selectedPhenomenon) {
        this.setPhenomenon(selectedPhenomenon);
        // this.selectedOtherPhenom = selectedPhenomenon.label;
      }
    });
  }

  public onStationSelected(platform: Platform) {
    const modal = this.modalCtrl.create(StationSelectorComponent,
      {
        platform,
        providerUrl: this.providerUrl
      }
    );
    modal.onDidDismiss(data => { if (data) { this.navCtrl.push(DiagramPage) } });
    modal.present();
  }

  public onMapLoading(loading: boolean) {
    this.loading = loading;
    this.cdr.detectChanges();
  }

  private getPhenomenonFromAPI(phenId: string) {
    this.api.getPhenomenon(phenId, this.providerUrl).subscribe(phenomenon => this.setPhenomenon(phenomenon));
  }

  private setPhenomenon(selectedPhenomenon: Phenomenon) {
    this.selectedPhenomenon = selectedPhenomenon;
    this.phenomenonFilter = { phenomenon: selectedPhenomenon.id };
    this.phenomenonLabel = this.getPhenomenonLabel(selectedPhenomenon.id);
    // this.ircelineSettings.getSettings(false).subscribe(settings =>
    //   this.overlayMaps = this.layerGen.getLayersForPhenomenon(selectedPhenomenon.id, settings.lastupdate, true)
    // );
  }

}
