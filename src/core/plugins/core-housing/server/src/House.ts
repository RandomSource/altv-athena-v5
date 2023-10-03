import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { IHouse } from '../../shared/interfaces/House';
import { Collections } from '@AthenaServer/database/collections';
import { HOUSE_SETTINGS } from '@AthenaPlugins/core-housing/shared/config';
import { PropertyState } from '@AthenaPlugins/gorl/shared/enums/PropertyStates';
import Database from '@stuyk/ezmongodb';
import { type } from 'os';

let globalHouses: Array<IHouse> = [];
export class HouseController {
    static async init() {
        if (Database.createCollection(Collections.Houses, true)) {
            // Load Houses
            globalHouses = await Database.fetchAllData<IHouse>(Collections.Houses);
            if (!globalHouses) {
                alt.logError('[WARNING] Es konnten keine Häuser geladen werden!');
            }
            globalHouses.forEach((x) => {
                HouseController.showBlip(x);
                HouseController.showLabel(x);
            });
        }

        if (!Database.createCollection(Collections.HouseStorage, true)) {
            // Load/Create House Storages
        }
        if (!Database.createCollection(Collections.HouseGarages, true)) {
            // Load House Garages
        }
        //Load House Object/Furniture
    }

    static async create(house: IHouse) {
        const result = await Database.insertData(house, Collections.Houses, true);
        if (result) {
            globalHouses.push(result);
            HouseController.showBlip(result);
            HouseController.showLabel(result);
        }
    }
    /**
     *  Show & Refesh the TextLabel , if it already exist the old one will be deleted
     */
    static showLabel(house: IHouse) {
        if (!house._id) return;
        // TextLabel
        if (HOUSE_SETTINGS.Label.Enable) {
            if (house.entityIds && house.entityIds.textlabel) {
                Athena.controllers.textLabel.remove(house.entityIds.textlabel);
            }
            let labelText = `Straße: ${house.streetName}\nHausNr: ${house.housenr}\nBesitzer: ${house.owner[0].name}\nPreis: ${house.price}`;
            const doorState = house.doorOpen ? 'Auf' : 'Zu';

            switch (house.state) {
                case PropertyState.SALE:
                    labelText = `~g~Zum Verkauf\nPreis: ${house.price}$\n Besitzer: ${house.owner[0].name}\nStraße: ${house.streetName}\nHausNr: ${house.housenr}`;
                    break;
                case PropertyState.SOLD:
                    labelText = HOUSE_SETTINGS.Label.ShowOwner
                        ? `Straße: ${house.streetName}\nHausNr: ${house.housenr}\nBesitzer: ${house.owner[0].name}\nTür:${doorState}`
                        : `Straße: ${house.streetName}\nHausNr: ${house.housenr}\nTür:${doorState}`;
                    break;
                case PropertyState.RENTABLE:
                    if (house.interior) {
                        const rentState = house.interior.rentable ? 'Ja' : 'Nein';
                        labelText = HOUSE_SETTINGS.Label.ShowOwner
                            ? `Straße: ${house.streetName}\nHausNr: ${house.housenr}\nBesitzer: ${house.owner[0].name}\nTür:${doorState}\nMieten: ${rentState}$\nBewohner: 0/${house.interior.max.residents}`
                            : `Straße: ${house.streetName}\nHausNr: ${house.housenr}\nTür:${doorState}\nMieten: ${rentState}$\nBewohner: 0/${house.interior.max.residents}`;
                    }
                    break;
                case PropertyState.LOCKED:
                    labelText = `Haus ist gesperrt!\nGrund: ${house.info}\nWende dich bei Fragen an die Stadtverwaltung.`;
                    break;
            }
            house.entityIds.textlabel = Athena.controllers.textLabel.append({
                text: labelText,
                pos: house.pos,
                maxDistance: HOUSE_SETTINGS.Label.Range,
                color: new alt.RGBA(255, 0, 0, 255),
                scale: HOUSE_SETTINGS.Label.Scale,
            });
        }
    }
    /**
     *  Show & Refesh the TextLabel , if it already exist the old one will be deleted
     */
    static showBlip(house: IHouse) {
        if (!house._id) return;
        // TextLabel
        if (HOUSE_SETTINGS.Blip.Enable) {
            if (house.entityIds && house.entityIds.blip) {
                Athena.controllers.blip.remove(house.entityIds.blip);
            }
            let blipColor;
            switch (house.state) {
                case PropertyState.SALE:
                    blipColor = HOUSE_SETTINGS.Blip.SaleBlipColor;
                    break;
                case PropertyState.SOLD:
                    blipColor = HOUSE_SETTINGS.Blip.SoldBlipColor;
                    break;
                case PropertyState.RENTABLE:
                    blipColor = HOUSE_SETTINGS.Blip.RentableBlipColor;
                    break;
                case PropertyState.LOCKED:
                    blipColor = HOUSE_SETTINGS.Blip.LockedBlipColor;
                    break;
            }
            house.entityIds.blip = Athena.controllers.blip.append({
                text: 'Haus',
                pos: house.pos,
                shortRange: true,
                sprite: HOUSE_SETTINGS.Blip.HouseBlip,
                color: blipColor,
                scale: 1.25,
            });
        }
    }
    static async findNext(pos: alt.Vector3, range: number = 10.0): Promise<IHouse> {
        //const houses = await Database.fetchAllData<IHouse>(Collections.Houses);
        if (globalHouses[0] === undefined) {
            return undefined;
        }
        const houses = globalHouses;
        if (!houses) {
            return undefined;
        }
        const housesInRange = houses.filter((x) => pos.distanceTo(x.pos) < range);
        return housesInRange[0];
    }
    static InRangeOfPos(pos: alt.Vector3, range: number = HOUSE_SETTINGS.DistanceToNextHouse): boolean {
        if (!globalHouses || globalHouses.length === 0) {
            return false;
        }
        const housesInRange = globalHouses.filter((x) => pos.distanceTo(x.pos) < range);
        alt.logDebug(housesInRange);
        const result = housesInRange.length === 0 ? true : false;
        alt.logDebug(result);
        return result;
    }

    static delete(houseId: string) {}
    static update(house: IHouse) {}
    static save(house: IHouse) {}

    static getHouseNumber(streetName: string): number {
        const housesInStreet = globalHouses.filter((x) => x.streetName === streetName);
        alt.logError(
            `getHouseNumber -> Typeof: ${typeof housesInStreet} Value: ${housesInStreet} Lenght: ${
                housesInStreet.length
            }`,
        );
        if (typeof housesInStreet === undefined || isNaN(housesInStreet.length)) {
            return 0;
        }
        return housesInStreet.length;
    }

    static hasValidKey(house: IHouse, ownerid: string, keyid: string): boolean {
        const owner = house.owner.find((x) => x.dbid === ownerid);
        if (!owner) {
            return false;
        }
        const validKey = owner.keys.find((x) => x === keyid);
        if (validKey) {
            return true;
        }
        return false;
    }
    static getByDbId(dbid: string): IHouse {
        return globalHouses.find((x) => x._id === dbid);
    }
    static getByIndex(index: number): IHouse {
        return globalHouses[index];
    }
    static getLast(): IHouse {
        return globalHouses[globalHouses.length];
    }
    static getFirst(): IHouse {
        return globalHouses[0];
    }
    static getCount(): number {
        let count;
        globalHouses.forEach((x) => {
            if (x) {
                count++;
            }
        });
        return count;
    }
}

alt.on('resourceStop', () => {
    globalHouses.forEach((x) => {
        if (x.entityIds.blip) {
            Athena.controllers.blip.remove(x.entityIds.blip);
        }
        if (x.entityIds.textlabel) {
            Athena.controllers.textLabel.remove(x.entityIds.textlabel);
        }
        if (x.entityIds.marker) {
            Athena.controllers.marker.remove(x.entityIds.marker);
        }
        if (x.entityIds.enterInteraction) {
            Athena.controllers.interaction.remove(x.entityIds.enterInteraction);
        }
    });
});
