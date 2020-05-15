import {NotificationType} from '../components/user-notification-settings/user-notification-settings.component';
import moment from 'moment';
import {BelAqiIndexResult} from '../services/bel-aqi.service';

const defaultStore = {
    'belAir.userNotificationSettings': null,
    'belAir.userLocations': null,
};

let store = {
    'belAir.userNotificationSettings': JSON.stringify([
        {
            notificationType: NotificationType.highConcentration,
            enabled: false,
        },
        {
            notificationType: NotificationType.transport,
            enabled: false,
        },
        {
            notificationType: NotificationType.activity,
            enabled: false,
        },
        {
            notificationType: NotificationType.allergies,
            enabled: false,
        },
        {
            notificationType: NotificationType.exercise,
            enabled: false,
        },
    ]),
    'belAir.userLocations': JSON.stringify([
        {label: 'Laeken', type: 'user', id: 0},
        {label: 'Koekelberg', type: 'user', id: 1},
        {label: 'Saint-Gilles', type: 'user', id: 2},
        {label: 'Ixelles', type: 'user', id: 3},
        {label: 'Berchem-Sainte-Agathe', type: 'user', id: 4}]
    )
    };

export const localStorageMock = {
    getItem: (key: string): string => {
        return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
        store[key] = `${value}`;
    },
    removeItem: (key: string) => {
        delete store[key];
    },
    clear: () => {
        store = defaultStore;
    },
    getIndexScores: ( pastDays: number, nextDays: number ): BelAqiIndexResult[] => {
        const indices = [];

        const locations = JSON.parse(store['belAir.userLocations']);
        locations.forEach( location => {
            for ( let i = -1 * pastDays ; i <= nextDays ; i++ ) {
                indices.push({
                    location,
                    date: moment().add(i, 'days'),
                    indexScore: Math.ceil(Math.random() * 10)
                });
            }
        });

        return indices;
    }
};
