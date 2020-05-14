
export class UserLocationServiceMock {
    getUserSavedLocations() {
        return [
            {label: 'Laeken', type: 'user', id: 0},
            {label: 'Koekelberg', type: 'user', id: 1},
            {label: 'Saint-Gilles', type: 'user', id: 2},
            {label: 'Ixelles', type: 'user', id: 3},
            {label: 'Berchem-Sainte-Agathe', type: 'user', id: 4}
            ];
    }
}
