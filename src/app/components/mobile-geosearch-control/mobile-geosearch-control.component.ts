import {
    Component,
    EventEmitter,
    Output,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { GeoSearch, GeosearchControlComponent, MapCache } from '@helgoland/map';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LocationAutocompleteService } from '../../services/location-autocomplete/location-autocomplete.service';
import { AutoCompleteComponent } from 'ionic4-auto-complete';

import * as L from 'leaflet';

@Component({
    selector: 'mobile-geosearch-control',
    templateUrl: './mobile-geosearch-control.component.html',
    styleUrls: ['./mobile-geosearch-control.component.scss'],
})
export class MobileGeosearchControlComponent extends GeosearchControlComponent
    implements OnInit, OnDestroy {
    @Output()
    public searchTriggered: EventEmitter<void> = new EventEmitter();

    @Output()
    public focusChangeEmitter: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('searchbar', { static: true })
    searchbar: AutoCompleteComponent;

    public labelAttribute: string;

    constructor(
        protected mapCache: MapCache,
        protected geosearch: GeoSearch,
        protected keyboard: Keyboard,
        public autocompleteService: LocationAutocompleteService
    ) {
        super(mapCache, geosearch);
    }

    ngOnInit() {
        this.autocompleteService.init();
    }

    ngOnDestroy() {
        this.autocompleteService.destroy();
    }

    public onItemSelected(term: string) {
        if (term) {
            this.searchTerm = term;
        } else {
            this.searchTerm = this.searchbar.suggestions[0];
            this.searchbar.writeValue(this.searchTerm);
        }
        this.searchTriggered.emit();
        this.triggerSearch();
        this.keyboard.hide();
    }

    public triggerSearch() {
        this.onSearchTriggered.emit();
        if (this.resultGeometry) {
            this.resultGeometry.remove();
        }
        if (this.searchTerm) {
            this.loading = true;
            this.geosearch.searchTerm(this.searchTerm, this.options).subscribe(
                (result) => {
                    if (!result) {
                        this.searchTerm = '';
                        this.onResultChanged.emit(null);
                        return;
                    }
                    this.result = result;
                    if (this.mapId && this.mapCache.getMap(this.mapId)) {
                        this.resultGeometry = L.geoJSON(result.geometry).addTo(
                            this.mapCache.getMap(this.mapId)
                        );
                        if (result.bounds) {
                            this.mapCache
                                .getMap(this.mapId)
                                .fitBounds(result.bounds);
                        } else {
                            this.mapCache
                                .getMap(this.mapId)
                                .fitBounds(this.resultGeometry.getBounds());
                        }
                    }
                    this.onResultChanged.emit(result);
                },
                (error) => {
                    this.searchTerm = 'error occurred';
                    this.onResultChanged.emit(null);
                },
                () => {
                    this.loading = false;
                }
            );
        }
    }
}
