import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import invert from 'invert-color';

import { getMainPhenomenonForID } from '../../model/phenomenon';
import { BelaqiIndexService } from '../../services/belaqi/belaqi.service';
import { CategorizedValueService } from '../../services/categorized-value/categorized-value.service';
import { IrcelineSettingsService } from '../../services/irceline-settings/irceline-settings.service';
import { ModelledValueService } from '../../services/modelled-value/modelled-value.service';
import { UserLocation } from '../../services/user-location-list/user-location-list.service';
import { SubIndexEntry } from './sub-index-panel.component';

@Component({
  selector: 'sub-index-panel-entry',
  templateUrl: './sub-index-panel-entry.component.html',
  styleUrls: ['./sub-index-panel-entry.component.scss'],
})
export class SubIndexPanelEntryComponent implements AfterViewInit {

  public color: string;
  public backgroundColor: string;

  public loading = true;

  @Input()
  public entry: SubIndexEntry;

  @Input()
  public location: UserLocation;

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  constructor(
    protected ircelineSettings: IrcelineSettingsService,
    protected modelledValue: ModelledValueService,
    protected categorizeValue: CategorizedValueService,
    protected belaqi: BelaqiIndexService,
  ) { }

  public ngAfterViewInit(): void {
    const phenomenon = getMainPhenomenonForID(this.entry.id);
    this.ircelineSettings.getSettings(false).subscribe(setts => {
      this.modelledValue.getValue(this.location.latitude, this.location.longitude, setts.lastupdate, phenomenon).subscribe(
        val => {
          const index = this.categorizeValue.categorize(val, phenomenon)
          this.backgroundColor = this.belaqi.getColorForIndex(index);
          this.color = invert(this.backgroundColor, true);
          this.loading = false;
        },
        () => { this.loading = false; }
      );
    });
  }

  public select() {
    this.selected.emit(this.entry.id);
  }

}
