import { OwnerType } from '../enums/Owner';

// Owner - Werte abhängig vom BesitzerTyp
export interface IOwner {
    name: string; // Name of the Owner or Company Name
    dbid?: string; // DBId of the Owner
    type: OwnerType; // Type -> State,Company,Civillian etc
    keys?: Array<string>; // List off the Key Item DBIds , maybe in future a type
    version?: number; // Version not in use but for big changes
}
