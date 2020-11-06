import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
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
        private loadingController: LoadingController,
        private toastController: ToastController,
        private translateSrvc: TranslateService,
        private geocoder: GeocoderService,
        private locateSrvc: LocateService
    ) { }

    ngOnInit() {
        this.filterItems();
    }

    // Getting the current location with native ionic plugin
    async getCurrentLocation() {
        const loading = await this.loadingController.create({
            message: this.translateSrvc.instant(
                'v2.components.location-input.please-wait'
            ),
        });
        await loading.present();

        this.locateSrvc.getUserLocation().subscribe(
            (resp) => {
                this.geocoder.reverse(resp.coords.latitude, resp.coords.longitude, { acceptLanguage: this.translateSrvc.currentLang })
                    .subscribe(
                        loc => {
                            if (this.geocoder.insideBelgium(loc.latitude, loc.longitude)) {
                                this.addLocation({
                                    id: new Date().getTime(),
                                    label: loc.label,
                                    type: 'user',
                                    latitude: loc.latitude,
                                    longitude: loc.longitude,
                                }, loading);
                            } else {
                                this.toastController.create({ message: 'Your currently location is outside of belgium, therefore no entry is created', duration: 2000 })
                                    .then(toast => toast.present());
                                loading.dismiss(null, 'cancel');
                            }
                        },
                        error => {
                            const l = this.geocoder.getLocationLabel(resp.coords.latitude, resp.coords.longitude);
                            const userLocation: UserLocation = {
                                id: new Date().getTime(),
                                label: l.label,
                                type: 'user',
                                latitude: l.latitude,
                                longitude: l.longitude,
                            };
                            this.addLocation(userLocation, loading);
                        }
                    );
            },
            (error) => {
                loading.dismiss(null, 'cancel');
                console.log('Error getting location', error);
            }
        );
    }

    private addLocation(location: UserLocation, loading: HTMLIonLoadingElement) {
        this.locationSelected.emit(location);
        this.searchText = location.label;
        loading.dismiss(null, 'cancel');
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
