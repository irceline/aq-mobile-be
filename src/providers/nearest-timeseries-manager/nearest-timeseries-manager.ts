import { Injectable } from '@angular/core';

import { UserLocation } from '../user-location-list/user-location-list';

@Injectable()
export class NearestTimeseriesManagerProvider {

    private nearestTimeseriesMap: Map<string, Map<string, string>> = new Map();

    private currentLocationTimeseries: Map<string, string> = new Map();

    public getNearestTimeseries(location: UserLocation): string[] {
        if (location.type === 'user') {
            return Array.from(this.nearestTimeseriesMap.get(location.label).values());
        }
        if (location.type === 'current') {
            return Array.from(this.currentLocationTimeseries.values());
        }
    }

    public setNearestTimeseries(location: UserLocation, phenomenonId: string, seriesId: string) {
        if (location.type === 'user') {
            if (!this.nearestTimeseriesMap.has(location.label)) {
                this.nearestTimeseriesMap.set(location.label, new Map());
            }
            this.nearestTimeseriesMap.get(location.label).set(phenomenonId, seriesId);
        }
        if (location.type === 'current') {
            this.currentLocationTimeseries.set(phenomenonId, seriesId);
        }
    }

}
