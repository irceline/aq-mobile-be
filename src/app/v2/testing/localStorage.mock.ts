import {NotificationType} from '../components/user-notification-settings/user-notification-settings.component';

const defaultStore = {
    'belAir.userNotificationSettings': null,
    'belAir.userLocations': null,
};

let store = {
    'belAir.userNotificationSettings': JSON.stringify([
        {
            notificationType: NotificationType.highConcentration,
            enabled: true,
        },
        {
            notificationType: NotificationType.transport,
            enabled: true,
        },
        {
            notificationType: NotificationType.activity,
            enabled: false,
        },
        {
            notificationType: NotificationType.allergies,
            enabled: true,
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
    }
};
