import { Station } from '@helgoland/core';

export const sliceStationLabel = (station: Station): string => {
    return station.properties.label.substring(9);
};
