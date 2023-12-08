import { ServerRpcEvent } from './../../../../../server/systems/rpc';
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { Collections } from '@AthenaServer/database/collections';
import { DEFAULT_HOUSE, IHouse } from '@AthenaPlugins/core-housing/shared/interfaces/House';
import { HOUSE_SETTINGS } from '@AthenaPlugins/core-housing/shared/config';
import { HouseController } from '../House';
import { RPCEventNames } from '@AthenaPlugins/gorl/shared/enums/rpcEventNames';
import { closest } from '@AthenaServer/utility';

//Athena.commands.register('cmd', '/cmd - desc', ['admin'], async (player: alt.Player) => {});
Athena.commands.register(
    'createhouse',
    '/createhouse - Erstellt ein Basis Haus an der aktuellen Position',
    ['admin'],
    async (player: alt.Player) => {
        if (HouseController.getCount() >= HOUSE_SETTINGS.MaxHouses) {
            Athena.systems.notification.toPlayer(player, 'Limit der Häuser erreicht!');
            return;
        }
        await Athena.systems.rpc.invoke(
            player,
            { eventName: RPCEventNames.getStreetName, msTimeout: 500 },
            (player: alt.Player, streetName: string) => {
                const newHouse: IHouse = {
                    ...DEFAULT_HOUSE,
                    pos: player.pos,
                    streetName: streetName,
                    housenr: HouseController.getHouseNumber(streetName) + 1,
                    price: 999999999,
                };
                HouseController.create(newHouse);
                alt.logError(`Straße des Hauses: ${streetName} HausNr: ${newHouse.housenr}`);
            },
        );
    },
);
Athena.commands.register(
    'edithouse',
    '/edithouse [Preis/Status(Lock)/Schloss(0,1,auf,zu)/Owner(Privat,Staat,Firma)] [Wert]- Verwaltet das nächste Haus in der Umgebung',
    ['admin'],
    async (player: alt.Player, type: string, value: string) => {},
);

Athena.commands.register('/delhouse', '/delhouse', ['admin'], async (player: alt.Player) => {
    closest.getClosestPlayer;
});
Athena.commands.register('/freehouse', '/freehouse - desc', ['admin'], async (player: alt.Player) => {});
