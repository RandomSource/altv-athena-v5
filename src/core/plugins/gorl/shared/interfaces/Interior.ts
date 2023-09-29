import { Vector3 } from 'alt-shared';
import { InteriorType } from '../enums/InteriorTypes';

export interface IInterior {
    name: string;
    price?: number;
    type: InteriorType;
    rentable: boolean; // Kann man dort Wohnen/Vermieten
    pos: {
        enter?: Vector3; // Position um den Innenraum zu betreten ???
        exit: Vector3; // Position um den Innenraum zu verlassen
        sleep?: Vector3; // Position wo man Schlafen kann
        garage?: Vector3; // Position um zur Garage zu kommen
        fridge?: Vector3; // Position vom Kühlschrank
        tresor?: Vector3; // Position vom Tresor
        elevator?: Vector3; // Position vom Aufzug
    };
    max: {
        // Max. Anzahl an ->
        residents?: number; //-> Bewohner
        vehicles?: number; // -> Parkende Fahrzeuge in der Garage
        cars?: number; // -> Parkende Autos(SUV,Sportcars,etc) in der Garage
        bikes?: number; // -> Motorräder in der Garage
        bicycle?: number; // -> Fahrräder in der Garage
        lkws?: number; // -> LKWS in der Garage/Halle
    };
}
