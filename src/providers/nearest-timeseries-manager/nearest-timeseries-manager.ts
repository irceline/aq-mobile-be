import { Injectable } from '@angular/core';

@Injectable()
export class NearestTimeseriesManagerProvider {

    private nearestTimeseriesMap: Map<string, Map<string, string>> = new Map();

    public getNearestTimeseries(label: string): string[] {
        return Array.from(this.nearestTimeseriesMap.get(label).values());
    }

    public setNearestTimeseries(label: string, phenomenonId: string, seriesId: string) {
        if (!this.nearestTimeseriesMap.has(label)) {
            this.nearestTimeseriesMap.set(label, new Map());
        }
        this.nearestTimeseriesMap.get(label).set(phenomenonId, seriesId);
    }

}
