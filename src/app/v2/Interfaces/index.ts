import { MainPhenomenon } from '../common/phenomenon';
import { PushNotification } from './../services/push-notifications/push-notifications.service';

export enum BelAirColor {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
}

// found from user-location-list.service.ts
export interface UserLocation {
    id?: number;
    label?: string;
    type: 'user';
    isCurrentVisible?: boolean;
    date?: Date;
    longitude?: number;
    latitude?: number;
    postalCode?: string;
    order?: number;
    wasEdited?: boolean;
    subscription?: LocationSubscription;
    notification?: PushNotification;
}

export interface LocationSubscription {
    lat: number;
    lng: number;
    language: string;
    key: string;
}

export interface IBarChartData {
    data: IBarChartDataItem[];
    labels: string[];
}

export interface IBarChartDataItem {
    value: number;
    background: string;
}

export interface Substance {
    name: string;
    abbreviation: string;
    unit?: string;
    phenomenon: MainPhenomenon;
}

export interface DataPoint {
    location: UserLocation;
    substance: Substance;
    currentValue?: number;
    currentIndex?: number;
    averageValue?: number;
    mainTab: boolean;

    // todo -> thresholds
    // are thresholds set on server side or defined in client?
    // how are the colors determinded for these thresholds?
    // for now, taking random values
    // https://www.irceline.be/nl/luchtkwaliteit/metingen/belaqi-luchtkwaliteitsindex/informatie
    evaluation: string;
    color: string;
}

export interface LongTermDataPoint extends DataPoint {
    euBenchMark: number;
    worldBenchMark: number;
    historicalValues: HistoricalValue[];
    showValues: boolean;
    chartData?: ChartData;
}

export interface ChartData {
    labels: string[];
    data: Array<{
        value: number;
        background: string;
    }>;
    max: number;
}

export interface HistoricalValue {
    value: number;
    year: number;
    evaluationColor: string;
}
