import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, IonInput } from '@ionic/angular';
import { UserLocation } from '../../Interfaces';
import locations from '../../../../assets/locations.json';

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss'],
})
export class LocationInputComponent implements OnInit {
    @ViewChild(IonInput) input: IonInput;

    searchText = '';
    visible = false;
    filteredItems: UserLocation[] = [];
    selectedItem: UserLocation | null = null;

    // @ts-ignore
    private _locations: UserLocation[] = locations.map( l => ({
        ...l,
        type: 'user'
    }));

    @Output() locationSelected = new EventEmitter<UserLocation>();

    constructor(
        private geolocation: Geolocation,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {
        this.filterItems();
    }

    // Getting the current location with native ionic plugin
    async getCurrentLocation() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
        });
        await loading.present();

        this.geolocation
            .getCurrentPosition()
            .then(async (resp) => {
                loading.dismiss(null, 'cancel');
                // todo --> reverse geocoding to region / label?
                this.locationSelected.emit({
                    id: 111,
                    label: 'TODO: reverse geocoding',
                    type: 'current',
                    latitude: resp.coords.latitude,
                    longitude: resp.coords.longitude,
                });
            })
            .catch((error) => {
                loading.dismiss(null, 'cancel');
                console.log('Error getting location', error);
            });
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
        this.filteredItems = this._locations.slice(0, 10);

        // filter items by label
        if (this.searchText.trim() !== '') {
            this.visible = true;
            this.filteredItems = this._locations.filter((item) => {
                return (
                    item.label
                        .toLowerCase()
                        .indexOf(this.searchText.toLowerCase()) > -1
                );
            }).slice(0, 10);
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
