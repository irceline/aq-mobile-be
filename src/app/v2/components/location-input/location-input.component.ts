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

@Component({
    selector: 'app-location-input',
    templateUrl: './location-input.component.html',
    styleUrls: ['./location-input.component.scss'],
})
export class LocationInputComponent implements OnInit {
    @Output() optionChange = new EventEmitter();
    @ViewChild(IonInput) input: IonInput;

    searchText = '';
    visible = false;
    items: any[] = [
        {
            name: 'English',
            key: 'en',
        },
        {
            name: 'French',
            key: 'fr',
        },
        {
            name: 'German',
            key: 'de',
        },
    ];
    filteredItems: any[] = [];
    selectedItem = null;

    // todo: Discuss with client -> is there a list of location that the user can search in,
    // is this provided by a service, we will just provide dummy data for now
    private _locations: UserLocation[] = [
        {
            id: 1,
            label: 'Antwerpen',
            type: 'user',
        },
        {
            id: 2,
            label: 'Brussels',
            type: 'user',
        },
        {
            id: 3,
            label: 'Chimay',
            type: 'user',
        },
    ];

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
                console.log(resp.coords);
                // todo --> reverse geocoding to region / label?
                this.locationSelected.emit({
                    id: 1,
                    label: 'Gent',
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

    chooseOption(item: any) {
        for (let index = 0; index < this.filteredItems.length; index++) {
            const element = this.filteredItems[index];
            if (element.key == item.key) {
                this.filteredItems[index].selected = true;
                this.selectedItem = element;
            } else {
                this.filteredItems[index].selected = false;
            }
        }

        this.searchText = this.selectedItem.name;
        this.input.setFocus();
        this.optionChange.next(this.selectedItem);
        this.closeDropdown();
    }

    filterItems() {
        this.filteredItems = this.items;
        if (this.searchText.trim() !== '') {
            this.visible = true;
            this.filteredItems = this.filteredItems.filter((item) => {
                return (
                    item.name
                        .toLowerCase()
                        .indexOf(this.searchText.toLowerCase()) > -1
                );
            });
        }
    }

    openDropdown() {
        this.visible = true;
    }

    closeDropdown() {
        this.visible = false;
    }
}
