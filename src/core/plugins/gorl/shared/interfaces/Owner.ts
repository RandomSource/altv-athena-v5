import { OwnerType } from '../enums/Owner';

// Owner - Werte abhängig vom BesitzerTyp
export interface IOwner {
    name: string;
    dbid: string;
    type: OwnerType;
    keys?: Array<string>; // List off the Key Item DBIds , maybe in future a type
    version?: number;
}
