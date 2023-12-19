import { HttpClient } from '@angular/common/http';

import { UserLocation } from '../../Interfaces';

export abstract class ValueProvider {

    constructor(
        // protected http: HttpClient
    ) { }

    protected calculateRequestBbox(latitude: number, longitude: number): string {
        // const r_earth = 6378;
        // const buf = 0.05;
        // const pi = Math.PI;
        // const minLatitude = latitude - (buf / r_earth) * (180 / pi);
        const minLatitude = latitude - 0.00001;
        // const maxLatitude = latitude + (buf / r_earth) * (180 / pi);
        const maxLatitude = latitude;
        // const minLongitude = longitude - (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
        const minLongitude = longitude;
        // const maxLongitude = longitude + (buf / r_earth) * (180 / pi) / Math.cos(latitude * pi / 180);
        const maxLongitude = longitude + 0.00001;
        return minLongitude + ',' + minLatitude + ',' + maxLongitude + ',' + maxLatitude;
    }

    protected getValueOfResponse(res: any): number {
        let idx;
        if (res && res.features && res.features.length === 1) {
            if (res.features[0].properties['GRAY_INDEX']) {
                const index = res.features[0].properties['GRAY_INDEX'];
                if (!isNaN(index)) {
                    idx = index;
                }
            }
        }
        return idx;
    }

    protected createFeatureInfoRequestParams(layerId: string, userLocation: UserLocation, timeParam?: string) {
        const params: any = {
            service: 'WMS',
            request: 'GetFeatureInfo',
            version: '1.1.1',
            layers: layerId,
            info_format: 'application/json',
            width: '1',
            height: '1',
            srs: 'EPSG:4326',
            // @ts-ignore
            bbox: this.calculateRequestBbox(userLocation?.latitude, userLocation.longitude),
            query_layers: layerId,
            X: '1',
            Y: '1',
        };
        if (timeParam) {
            params.time = timeParam;
        }
        return params;
    }

}
