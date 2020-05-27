import {UserLocation} from '../Interfaces';
import {Moment} from 'moment';
import {indexLabel, lightIndexColor} from '../common/constants';

const substances = [
    {
        name: 'ozon',
        abbreviation: 'O&#8323;',
        unit: 'µg/m3'
    },
    {
        name: 'nitrogen-dioxide',
        abbreviation: 'NO&#8322;',
        unit: 'µg/m3'
    },
    {
        name: 'fine-dust',
        abbreviation: 'PM 10',
        unit: 'µg/m3'
    },
    {
        name: 'very-fine-dust',
        abbreviation: 'PM 2,5',
        unit: 'µg/m3'
    },
];
export const dataService = {
    getMeasurmentsFor(location: UserLocation, day: Moment, belaqi: number) {
        return substances.map( s => {

            // const belaqi =  Math.ceil( Math.random() * 10 );

            return {
                location,
                day,
                substance: s,
                currentValue: 20 +  Math.ceil( Math.random() * 150 ),
                averageValue: 40 + Math.ceil( Math.random() * 80 ),
                evaluation: indexLabel[belaqi] || null,
                color: lightIndexColor[belaqi] || null
            };
        });
    }
};
