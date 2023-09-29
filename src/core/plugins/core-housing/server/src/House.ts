import { TextLabel } from './../../../../shared/interfaces/textLabel';
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IHouse } from '../../shared/interfaces/House';
import { Collections } from '@AthenaServer/database/collections';
import { HOUSE_SETTINGS } from '@AthenaPlugins/core-housing/shared/config';
import { PropertyState } from '@AthenaPlugins/gorl/shared/enums/PropertyStates';

export class HouseController {
    static init() {
        // Load Houses
        // Load House Garages
        // Load/Create House Storages
    }
    static async create(house: IHouse, player: alt.Player) {
        const result = await Athena.database.singleton.create(Collections.Houses, house);
        if (result) {
        }
    }
    /**
     *  Show & Refesh the TextLabel , if it already exist the old one will be deleted
     */
    static showLabel(house: IHouse) {
        if (!house._id) return;
        // TextLabel
        if (HOUSE_SETTINGS.Label.Enable) {
            if (house.entityIds.textlabel) {
                Athena.controllers.textLabel.remove(house.entityIds.textlabel);
            }
            let labelText = `HausNr: ${house.streetnr}\nStraße: ${house.street}\nBesitzer: ${house.owner[0].name}\nPreis: ${house.price}`;
            const doorState = house.doorOpen ? 'Auf' : 'Zu';
            const rentState = house.interior.rentable ? 'Ja' : 'Nein';
            switch (house.state) {
                case PropertyState.SALE:
                    labelText = `Zum Verkauf\nPreis: ${house.price}$\n Besitzer: ${house.owner[0].name}`;
                case PropertyState.SOLD:
                    labelText = HOUSE_SETTINGS.Label.ShowOwner
                        ? `HausNr: ${house.streetnr}\nStraße: ${house.street}\nBesitzer: ${house.owner[0].name}\nTür:${doorState}`
                        : `HausNr: ${house.streetnr}\nStraße: ${house.street}\nTür:${doorState}`;
                case PropertyState.RENTABLE:
                    labelText = HOUSE_SETTINGS.Label.ShowOwner
                        ? `HausNr: ${house.streetnr}\nStraße: ${house.street}\nBesitzer: ${house.owner[0].name}\nTür:${doorState}\nMieten: ${rentState}$\nBewohner: 0/${house.interior.max.residents}`
                        : `HausNr: ${house.streetnr}\nStraße: ${house.street}\nTür:${doorState}\nMieten: ${rentState}$\nBewohner: 0/${house.interior.max.residents}`;
                case PropertyState.LOCKED:
                    labelText = `Haus ist gesperrt!\nGrund: ${house.info}\nWende dich bei Fragen an die Stadtverwaltung.`;
            }
            house.entityIds.textlabel = Athena.controllers.textLabel.append({
                text: labelText,
                pos: house.pos,
                maxDistance: HOUSE_SETTINGS.Label.Range,
            });
        }
    }
    static delete(houseId: string) {}
    static update(house: IHouse) {}
    static save(house: IHouse) {}
}
