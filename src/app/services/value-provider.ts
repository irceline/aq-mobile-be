import { HttpClient } from '@angular/common/http';

export abstract class ValueProvider {

    constructor(
        protected http: HttpClient
    ) { }

    protected calculateRequestBbox(latitude: number, longitude: number): string {
        const r_earth = 6378;
        const buf = 0.05;
        const pi = Math.PI;
        const minLatitude = latitude - (buf / r_earth) * (180 / pi);
        const maxLatitude = latitude + (buf / r_earth) * (180 / pi);
        const minLongitude = longitude - (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
        const maxLongitude = longitude + (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
        return minLongitude + ',' + minLatitude + ',' + maxLongitude + ',' + maxLatitude;
    }

}
