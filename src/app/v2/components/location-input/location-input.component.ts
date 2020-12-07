import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import locations from '../../../../assets/locations.json';
import { UserLocation } from '../../Interfaces';
import { MobileSettings } from '../../services/settings/settings.service';
import { LocationEditComponent } from '../location-edit/location-edit.component';
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

    @Input() editable = false;

    searchText = '';
    visible = false;
    filteredItems: UserLocation[] = [];
    selectedItem: UserLocation | null = null;

    editableLocation: UserLocation;

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
        private locateSrvc: LocateService,
        private modalController: ModalController,
        private settingsSrvc: SettingsService<MobileSettings>
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
                                this.toastController.create({ message: 'Your current location is outside of Belgium, therefore no entry is created', duration: 2000 })
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

    private addLocation(location: UserLocation, loading?: HTMLIonLoadingElement) {
        this.searchText = location.label;
        if (loading) {
            loading.dismiss(null, 'cancel');
        }
        if (this.editable) {
            this.editableLocation = location;
        } else {
            this.locationSelected.emit(location);
        }
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
        this.addLocation(this.selectedItem);
        this.closeDropdown();
    }

    // filter logic
    filterItems() {
        const defaultLocations = this.settingsSrvc.getSettings().defaultSelectableLocations;

        // search in defined locations
        this.filteredItems = this._locations.filter(l => defaultLocations.findIndex(e => e === l.label) >= 0);

        // sort locations
        this.filteredItems = defaultLocations.map(e => this.filteredItems.find(fi => fi.label === e));

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

    async editLocation() {
        const modal = await this.modalController.create({
            component: LocationEditComponent,
            componentProps: {
                userLocation: this.editableLocation
            }
        });
        await modal.present();
        const loc = await (await modal.onWillDismiss()).data as UserLocation;
        this.addLocation(loc);
    }

    confirmLocation() {
        this.locationSelected.emit(this.editableLocation);
    }
}
