import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { baseItems } from './items';
import { equip, unequip, checkToEquip, checkToUnequip } from './fishingRod';
import { FishingEvents } from '../shared/events';
import { tryFishing } from './fishing';

const PLUGIN_NAME = 'fishing';

async function init() {
    // Initialize Base Items
    for (let baseItem of baseItems) {
        await Athena.systems.inventory.factory.upsertAsync(baseItem);
    }

    Athena.player.events.on('item-equipped', equip);
    Athena.player.events.on('item-unequipped', unequip);
    Athena.player.events.on('selected-character', checkToEquip);
    //Athena.player.events.on('onDrop', checkToUnequip);
    alt.onClient(FishingEvents.fromClient.try, tryFishing);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, init);
