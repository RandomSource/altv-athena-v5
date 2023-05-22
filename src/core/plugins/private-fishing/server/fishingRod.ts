import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import IAttachable from '@AthenaShared/interfaces/iAttachable';
import { FishingEvents } from '../shared/events';

const SessionKey = 'stuyk-fishing-rod-attachment';
const ITEM_NAME = 'fishingrod';

declare global {
    namespace AthenaSession {
        export interface Player {
            [SessionKey]: string;
        }
    }
}

export function equip(player: alt.Player, slot: number, type: 'inventory' | 'toolbar') {
    const item = Athena.player[type].getAt<IAttachable>(player, slot);
    if (typeof item === 'undefined' || item.dbName !== ITEM_NAME) {
        return;
    }

    let uid = Athena.session.player.get(player, SessionKey);
    if (typeof uid !== 'undefined') {
        Athena.player.emit.objectRemove(player, uid);
        Athena.session.player.clearKey(player, SessionKey);
    }

    uid = Athena.player.emit.objectAttach(player, item.data);
    Athena.session.player.set(player, SessionKey, uid);
    Athena.player.emit.notification(player, 'Drücke "E", um mit dem Angeln zu beginnen');
    player.emit(FishingEvents.toClient.start);
}

function removeSessionKey(player: alt.Player) {
    const uid = Athena.session.player.get(player, SessionKey);
    if (typeof uid === 'undefined') {
        return;
    }

    Athena.player.emit.objectRemove(player, uid);
    Athena.session.player.clearKey(player, SessionKey);
    player.emit(FishingEvents.toClient.stop);
}

export function unequip(player: alt.Player, slot: number, type: 'inventory' | 'toolbar') {
    const item = Athena.player[type].getAt<IAttachable>(player, slot);
    if (typeof item === 'undefined' || item.dbName !== ITEM_NAME) {
        return;
    }

    removeSessionKey(player);
}

export function checkToUnequip(player: alt.Player, dbName: string) {
    if (dbName !== ITEM_NAME) {
        return;
    }

    checkToEquip(player);
}

export function checkToEquip(player: alt.Player) {
    const toolbar = Athena.player.get.toolbar(player);
    const inventory = Athena.player.get.inventory(player);

    let wasFound = false;
    for (let item of toolbar) {
        if (item.dbName !== ITEM_NAME) {
            continue;
        }

        if (item.isEquipped) {
            equip(player, item.slot, 'toolbar');
        }

        wasFound = true;
        break;
    }

    for (let item of inventory) {
        if (item.dbName !== ITEM_NAME) {
            continue;
        }

        if (wasFound) {
            break;
        }

        if (item.isEquipped) {
            equip(player, item.slot, 'toolbar');
        }

        wasFound = true;
        break;
    }

    if (wasFound) {
        return;
    }

    const uid = Athena.session.player.get(player, SessionKey);
    if (typeof uid === 'undefined') {
        return;
    }

    Athena.player.emit.objectRemove(player, uid);
    Athena.session.player.clearKey(player, SessionKey);
    player.emit(FishingEvents.toClient.stop);
}
