import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { InventoryView } from '@AthenaPlugins/gorl-inventory/server/src/view';
import { ItemEx, StoredItem, StoredItemEx } from '@AthenaShared/interfaces/item';
import IAttachable from '@AthenaShared/interfaces/iAttachable';

const PLUGIN_NAME = 'Test Item Container Plugin';
const SessionKey = 'storage-box-attachment';

declare global {
    namespace AthenaSession {
        export interface Player {
            [SessionKey]: string;
        }
    }
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    Athena.systems.inventory.factory.upsertAsync({
        name: 'TestContainerv3',
        dbName: 'fuckstorage',
        icon: 'assets/icons/crate.png',
        data: {
            model: 'prop_paper_box_01',
            pos: {
                x: -6.938893903907228e-18,
                y: -0.039999999999999994,
                z: 0.16,
            },
            rot: { x: -6.938893903907228e-18, y: -0.32, z: 0.18 },
            bone: 58,
        },
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: false,
            isEquippable: true,
            isToolbar: false,
        },
        consumableEventToCall: 'test-container-open',
    });
    Athena.systems.inventory.factory.upsertAsync({
        name: 'Werkzeugkiste',
        dbName: 'toolbox',
        icon: 'assets/icons/toolbox.png',
        data: {
            bone: 58,
            pos: {
                x: 0.5,
                y: 0,
                z: 0.1,
            },
            rot: {
                x: 0,
                y: 251,
                z: 79,
            },
            model: 'prop_tool_box_01',
        },
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: false,
            isEquippable: true,
            isToolbar: false,
        },
        consumableEventToCall: 'test-container-open',
    });
});

async function createAndOpen(player: alt.Player) {
    const id = await Athena.systems.storage.create([]);
    openStorage(player, id);
}

async function openStorage(player: alt.Player, uid: string, slots: number = 10) {
    if (Athena.systems.storage.isOpen(uid)) {
        alt.logWarning('Storage is Open');
        Athena.systems.storage.removeAsOpen(uid);
        return;
    }

    Athena.systems.storage.setAsOpen(uid);
    Athena.systems.storage.closeOnDisconnect(player, uid);

    const storedItems = await Athena.systems.storage.get(uid);

    InventoryView.storage.open(player, uid, storedItems, slots, false, 10, 40, 90);
}

async function closeStorage(uid: string, items: Array<StoredItem>, player: alt.Player) {
    if (!Athena.systems.storage.isOpen(uid)) {
        return;
    }
    alt.logError('CloseStorage');
    await Athena.systems.storage.set(uid, items);
    Athena.systems.storage.removeAsOpen(uid);
    const sessionId = Athena.session.player.get(player, SessionKey);
    alt.logError(` SessionKey Close Storage: ${sessionId}`);
    if (typeof sessionId === 'undefined') {
        alt.logError('SessionKey Undefined ?');
        return;
    }

    Athena.player.emit.objectRemove(player, sessionId);
    Athena.session.player.clearKey(player, SessionKey);
}

Athena.commands.register('tstore2', '/tstore -Create Test Storage -> ItemStorage', ['admin'], (player: alt.Player) => {
    createAndOpen(player);
});
Athena.commands.register('tstore', '/tstore -Create Test Storage -> ItemStorage', ['admin'], (player: alt.Player) => {
    InventoryView.controls.close(player);
    openStorage(player, '64727dfc3d20ff2d20b80e72');
});
Athena.commands.register('tit', '/tit - Test Storage Item ', ['admin'], async (player: alt.Player) => {
    const storageId = await Athena.systems.storage.create([]);
    alt.logWarning(` AddedItem & New Storage Created with ID ${storageId}`);
    Athena.player.inventory.add(player, {
        dbName: 'fuckstorage',
        quantity: 1,
        data: { storageId: storageId },
    });
});

InventoryView.callbacks.add('close', closeStorage);

Athena.systems.inventory.effects.add(
    'test-container-open',
    async (player: alt.Player, slot: number, type: 'inventory' | 'toolbar') => {
        const propertyName = String(type);
        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined' || typeof data[propertyName] === 'undefined') {
            return;
        }
        const item = Athena.systems.inventory.slot.getAt<{ storageId }>(slot, data[propertyName]);
        if (typeof item === 'undefined') {
            return;
        }

        const index = data[propertyName].findIndex((x) => x.slot === slot);
        if (index <= -1) {
            return;
        }
        //alt.logWarning(`${JSON.stringify(item)}`);
        let uid = Athena.session.player.get(player, SessionKey);
        if (typeof uid !== 'undefined') {
            Athena.player.emit.objectRemove(player, uid);
            Athena.session.player.clearKey(player, SessionKey);
        }

        const itemDataAttachment = Athena.systems.inventory.slot.getAt<IAttachable>(slot, data[propertyName]);
        if (typeof itemDataAttachment === 'undefined') {
            return;
        }
        uid = Athena.player.emit.objectAttach(player, itemDataAttachment.data);
        alt.logError(` SessionKey Open Storage: ${uid}`);
        Athena.session.player.set(player, SessionKey, uid);

        if (typeof item.data === 'undefined' || typeof item.data.storageId === 'undefined') {
            const storageId = await Athena.systems.storage.create([]);
            alt.logWarning(` New Storage Created with ID ${storageId}`);
            Athena.systems.inventory.manager.setData<{ storageId }>(item, { storageId: storageId });
            openStorage(player, storageId);
            return;
        }
        //
        if (Athena.systems.storage.isOpen(item.data.storageId)) {
            const storedItems = await Athena.systems.storage.get(item.data.storageId);
            closeStorage(item.data.storageId, storedItems, player);
            return;
        }
        openStorage(player, item.data.storageId);
    },
);
