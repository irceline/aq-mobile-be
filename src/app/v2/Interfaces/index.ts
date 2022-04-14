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
    indexThreshold?: number;
    notification?: PushNotification;
}

export interface LocationSubscription {
    lat: number;
    lng: number;
    language: string;
    index?: number;
    key: string;
    version: string;
    uniqueId: string;
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
    lastAnnualIndex?: {
        color: string;
        label: string;
    };
    showValues: boolean;
    showThreshold: boolean;
    mainTab: boolean;
    euBenchMark: number;
    worldBenchMark: number;

    // todo -> thresholds
    // are thresholds set on server side or defined in client?
    // how are the colors determinded for these thresholds?
    // for now, taking random values
    // https://www.irceline.be/nl/luchtkwaliteit/metingen/belaqi-luchtkwaliteitsindex/informatie
    evaluation: string;
    color: string;
}

export interface LongTermDataPoint extends DataPoint {
    historicalValues: HistoricalValue[];
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
