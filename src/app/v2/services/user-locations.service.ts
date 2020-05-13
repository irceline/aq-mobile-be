import { Injectable } from '@angular/core';
import locations from '../../../assets/locations.json';
import { UserLocation } from '../Interfaces';

@Injectable({
    providedIn: 'root',
})
export class UserLocationsService {
    constructor() {}

    static getUserSavedLocations(): UserLocation[] {
        const startPoint = Math.floor(Math.random() * (locations.length - 5));

        // randomly return 5 locations before integration
        // @ts-ignore
        return locations.slice(startPoint, startPoint + 5);
    }
}
