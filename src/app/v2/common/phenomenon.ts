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
};

export const PhenomenonIDMapping = [
    {
        phenomenon: MainPhenomenon.BC,
        id: PhenomenonSeriesID.BC
    },
    {
        phenomenon: MainPhenomenon.NO2,
        id: PhenomenonSeriesID.NO2
    },
    {
        phenomenon: MainPhenomenon.O3,
        id: PhenomenonSeriesID.O3
    },
    {
        phenomenon: MainPhenomenon.PM10,
        id: PhenomenonSeriesID.PM10
    },
    {
        phenomenon: MainPhenomenon.PM25,
        id: PhenomenonSeriesID.PM25
    }
];

export const getMainPhenomenonForID = (id: string): MainPhenomenon => {
    const entry = PhenomenonIDMapping.find(e => e.id === id);
    return entry ? entry.phenomenon : null;
};

export const getIDForMainPhenomenon = (phenomenon: MainPhenomenon): string => {
    return PhenomenonIDMapping.find(e => e.phenomenon === phenomenon).id;
};
