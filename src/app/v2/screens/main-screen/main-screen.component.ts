import { Component, OnInit } from '@angular/core';
import {UserLocation} from '../../Interfaces';
import {UserLocationsService} from '../../services/user-locations.service';
import {BelAqiIndexResult, BelAQIService} from '../../services/bel-aqi.service';
import moment from 'moment';

@Component({
    selector: 'app-main-screen',
    templateUrl: './main-screen.component.html',
    styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {

    // location data
    locations: UserLocation[] = [];
    currentLocation: UserLocation;

    // belAqi data
    private belAqiScores: BelAqiIndexResult[] = [];
    belAqiForCurrentLocation: BelAqiIndexResult[] = [];
    currentActiveIndex: BelAqiIndexResult;

    drawerOptions: any;

    constructor( private userlocations: UserLocationsService, private belAqiService: BelAQIService ) {

        this.locations = UserLocationsService.getUserSavedLocations();
        this.belAqiScores = this.belAqiService.getIndexScores( this.locations, 5, 5 );

        // activate first location by default
        this.updateCurrentLocation( this.locations[0] );
    }

    private updateCurrentLocation( location: UserLocation ) {
        this.currentLocation = location;
        this.belAqiForCurrentLocation = this.belAqiScores.filter( ( iR ) => iR.location.id === location.id );
        this.currentActiveIndex = this.belAqiForCurrentLocation.find( iR => Math.abs(iR.date.diff( moment(), 'days' ))  === 0 );

        // update active index on service which is used throughout the other screen
        this.belAqiService.activeIndex = this.currentActiveIndex;
    }

    ngOnInit() {
        this.drawerOptions = {
            handleHeight: 197,
            gap: 150,
            thresholdFromBottom: 300,
            thresholdFromTop: 200,
            bounceBack: true,
        };
    }

    onLocationChange(location: UserLocation) {
        this.updateCurrentLocation(location);
    }

    onDayChange(index: BelAqiIndexResult) {
        this.currentActiveIndex = index;
        this.belAqiService.activeIndex = this.currentActiveIndex;
    }
}
