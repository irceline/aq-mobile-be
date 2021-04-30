import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SettingsService } from '@helgoland/core';
import { IonInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import locations from '../../../../assets/locations.json';
import { UserLocation } from '../../Interfaces';
import { MobileSettings } from '../../services/settings/settings.service';
import { LocationEditComponent } from '../location-edit/location-edit.component';
import { GeocoderService } from './../../services/geocoder/geocoder.service';
import { LocateService } from './../../services/locate/locate.service';

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss', './location-input.component.hc.scss'],
})
export class LocationInputComponent implements OnInit, OnDestroy {
    @ViewChild(IonInput, { static: true }) input: IonInput;

    @Input() currentLocation = true;

    @Input() editable = false;

    searchText = '';
    visible = false;
    filteredItems: UserLocation[] = [];
    selectedItem: UserLocation | null = null;

    editableLocation: UserLocation;

    private _locations: UserLocation[];

    @Output() locationSelected = new EventEmitter<UserLocation>();
    private langSubscription: Subscription;

    constructor(
        private loadingController: LoadingController,
        private toastController: ToastController,
        private translateSrvc: TranslateService,
        private geocoder: GeocoderService,
        private locateSrvc: LocateService,
        private modalController: ModalController,
        private settingsSrvc: SettingsService<MobileSettings>
    ) { }

    ngOnDestroy(): void {
        if (this.langSubscription) { this.langSubscription.unsubscribe() }
    }

    ngOnInit() {
        this.langSubscription = this.translateSrvc.onLangChange.subscribe((code: LangChangeEvent) => {
            if (code && code.lang) this.updateSelectableLocations(code.lang)
        });
        this.updateSelectableLocations(this.translateSrvc.currentLang);
    }

    private updateSelectableLocations(code: string) {
        this._locations = locations.map(e => {
            return {
                id: e.id,
                label: `${e.label[code]}`,
                type: 'user',
                postalCode: e.postalcode,
                longitude: e.longitude,
                latitude: e.latitude
            };
        });
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
                                this.toastController.create({ message: this.translateSrvc.instant('v2.components.location-input.success-add-location'), duration: 2000 })
                                    .then(toast => toast.present());
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
        if (this.editable) this.searchText = location.label;
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

        if (this.editable) this.searchText = this.selectedItem.label;
        else {
            this.toastController.create({ message: this.translateSrvc.instant('v2.components.location-input.success-choose-location'), duration: 2000 })
                .then(toast => toast.present());
        }
        // set cursor after selected option
        this.input.setFocus();
        // emit selected option
        this.addLocation(this.selectedItem);
        this.closeDropdown();
    }

    // filter logic
    filterItems() {
        const code = this.translateSrvc.currentLang;
        const defaultLocations = code ? this.settingsSrvc.getSettings().defaultSelectableLocations[code] : null;

        if (defaultLocations) {
            // search in defined locations
            this.filteredItems = this._locations.filter(l => defaultLocations.findIndex(e => e === l.label) >= 0);

            // sort locations
            this.filteredItems = defaultLocations.map(e => this.filteredItems.find(fi => fi.label === e)).filter(e => e !== undefined);

            // filter items by label
            if (this.searchText.trim() !== '') {
                this.filteredItems = this._locations
                    .filter((item) => {
                        return (
                            item.label.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
                            item.postalCode.startsWith(this.searchText)
                        );
                    })
                    .slice(0, 10);
                
                // Show the dropdown when typing
                this.visible = true;
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
    }

    openDropdown() {
        this.visible = !this.visible;
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
        if (loc) {
            this.addLocation(loc);
            this.btnStateConfirmLocation = 'solid';
        }
    }

    btnStateConfirmLocation: string = 'solid';
    confirmLocation() {
        this.locationSelected.emit(this.editableLocation);
        this.btnStateConfirmLocation = 'clear';
    }
}
