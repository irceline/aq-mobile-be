// General Phenomenon Enum of the main phenomenons
export enum MainPhenomenon {
    NO2,
    O3,
    PM10,
    PM25,
    BC
}

export const PhenomenonSeriesID = {
    BC: '391',
    NO2: '8',
    O3: '7',
    PM10: '5',
    PM25: '6001'
}

export const PhenomenonIDMapping = [
    {
        phenomenon: MainPhenomenon.BC,
        id: '391'
    },
    {
        phenomenon: MainPhenomenon.NO2,
        id: '8'
    },
    {
        phenomenon: MainPhenomenon.O3,
        id: '7'
    },
    {
        phenomenon: MainPhenomenon.PM10,
        id: '5'
    },
    {
        phenomenon: MainPhenomenon.PM25,
        id: '6001'
    }
]

export const getMainPhenomenonForID = (id: string): MainPhenomenon => {
    return PhenomenonIDMapping.find(e => e.id === id).phenomenon;
}