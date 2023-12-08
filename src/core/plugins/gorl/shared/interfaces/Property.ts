// Base Interface for Buldings,Houses,Apartment,Shops
// Extend this for new Building and add new Propertys

import { Vector3 } from 'alt-shared';
import { IOwner } from './Owner';
import { IInterior } from './Interior';
import { PropertyState } from '../enums/PropertyStates';
import { Entity } from 'alt-client';

export interface IProperty {
    _id?: unknown;
    name?: string;
    streetName?: string;
    housenr?: number; // HausNummer
    pos: Vector3;
    price?: number;
    state: PropertyState; // Status des Hauses -> Kaufbar,Verkauft,Mietbar,Locked
    doorOpen: boolean; // Schloss -> Offen = true / Zu = false
    owner: Array<IOwner>; // Liste der Besitzer & BesitzerTyp
    interior?: IInterior; // Innenraum
    dimension?: number | 0; // Dimension/ Virtuelle Welt
    info?: string; // Info/Notiz Wissenwertes zum Property zB: Haus gesperrt weil man durch den Boden fällt
    blip?: {
        icon?: number;
        sprite?: number;
        color?: number;
        text?: string;
        attached?: Entity;
        range?: number | 20.0;
    };
    entityIds?: {
        // Ids der erstellen Entitys wie Marker,Colshapes,Textlabels
        blip?: string;
        textlabel?: string;
        enterInteraction?: string;
        marker?: string;
    };
}
