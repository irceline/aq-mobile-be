
export class GeolocationMock {
    latitude = 1;
    longitude = 1;

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            resolve({
                coords: {
                    latitude: this.latitude,
                    longitude: this.longitude
                }
            });
        });
    }

    setLatitude(latitude) {
        this.latitude = latitude;
        console.log('Latitude changed to: ', latitude);
    }

    setLongitude(longitude) {
        this.longitude = longitude;
        console.log('Longitude changed to: ', longitude);
    }
}
