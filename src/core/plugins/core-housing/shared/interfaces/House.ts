import { Vector3 } from 'alt-shared';
import { IProperty } from '@AthenaPlugins/gorl/shared/interfaces/Property';
import { PropertyState } from '@AthenaPlugins/gorl/shared/enums/PropertyStates';

const DEFAULT_HOUSE: IHouse = {
    name: 'Neues Haus',
    pos: new Vector3(0, 0, 0),
    state: PropertyState.SALE,
    doorOpen: false,
    owner: [],
};

export interface IHouse extends IProperty {
    garage?: Array<string>; // Garagen DbId
    storages?: Array<string>; // Item Storage DbId
    contracts?: Array<string>; // Player Contract DbId exp for rent a house
}
