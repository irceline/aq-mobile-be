import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { IonInput, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import locations from '../../../../assets/locations.json';
import { UserLocation } from '../../Interfaces';
import { GeocoderService } from './../../services/geocoder/geocoder.service';
import { LocateService } from './../../services/locate/locate.service';

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss'],
})
export class LocationInputComponent implements OnInit {
    @ViewChild(IonInput, { static: true }) input: IonInput;

    @Input() currentLocation = true;

    searchText = '';
    visible = false;
    filteredItems: UserLocation[] = [];
    selectedItem: UserLocation | null = null;

    // @ts-ignore
    private _locations: UserLocation[] = locations.map((l) => ({
        ...l,
        type: 'user',
    }));

    @Output() locationSelected = new EventEmitter<UserLocation>();

    constructor(
        public loadingController: LoadingController,
        private translate: TranslateService,
        private geocoder: GeocoderService,
        private locateSrvc: LocateService
    ) {}

    ngOnInit() {
        this.filterItems();
    }

    // Getting the current location with native ionic plugin
    async getCurrentLocation() {
        const loading = await this.loadingController.create({
            message: this.translate.instant(
                'v2.components.location-input.please-wait'
            ),
        });
        await loading.present();

        this.locateSrvc.getUserLocation().subscribe(
            (resp) => {
                loading.dismiss(null, 'cancel');
                const location = this.geocoder.getLocationLabel(
                    resp.coords.latitude,
                    resp.coords.longitude
                );
                this.locationSelected.emit({
                    id: 111,
                    label: location.label,
                    type: 'user',
                    latitude: location.latitude,
                    longitude: location.longitude,
                });
                this.searchText = location.label;
            },
            (error) => {
                loading.dismiss(null, 'cancel');
                console.log('Error getting location', error);
            }
        );
    }

    // Choosing option from dropdown
    chooseOption(item: any) {
        // set selected on true
        for (let index = 0; index < this.filteredItems.length; index++) {
            const element = this.filteredItems[index];
            if (element.id === item.id) {
                this.selectedItem = element;
            }
        }

        this.searchText = this.selectedItem.label;
        // set cursor after selected option
        this.input.setFocus();
        // emit selected option
        this.locationSelected.next(this.selectedItem);
        this.closeDropdown();
    }

    // filter logic
    filterItems() {
        this.filteredItems = this._locations.slice(0, 5);

        // filter items by label
        if (this.searchText.trim() !== '') {
            this.visible = true;
            this.filteredItems = this._locations
                .filter((item) => {
                    return (
                        item.label
                            .toLowerCase()
                            .indexOf(this.searchText.toLowerCase()) > -1
                    );
                })
                .slice(0, 10);
        }

        // if we remove the option, remove select and emit null
        if (this.searchText.trim() === '' && !this.visible) {
            for (let index = 0; index < this.filteredItems.length; index++) {
                const element = this.filteredItems[index];
                this.selectedItem = null;
            }

            // emit null
            this.locationSelected.next(null);
        }
    }

    openDropdown() {
        this.visible = true;
    }

    closeDropdown() {
        this.visible = false;
    }
}
