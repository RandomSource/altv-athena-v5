import { BaseItem } from '@AthenaShared/interfaces/item';
import { FishingRodAttachment } from './rodAttachments';

export const fishingRods = [
    {
        name: 'Angelroute Basic',
        dbName: 'fishingrodbasic',
        icon: '/plugins/fishing-rods/fishingrod.png',
        data: {
            fishing: {
                maxWeight: 5.0, // Max. Fish Weight in KG
                successRate: 0.2,
                experiance: 0.5,
            },
            ...FishingRodAttachment,
        },
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: true,
            isEquippable: true,
            isToolbar: true,
        },
        maxStack: 1,
        version: 1,
        model: 'prop_fishing_rod_01',
    },
    {
        name: 'Angelroute Mid',
        dbName: 'fishingrodmid',
        icon: '/plugins/fishing-rods/fishingrod.png',
        data: {
            fishing: {
                maxWeight: 5.0, // KG
                successRate: 0.2,
                experiance: 0.5,
            },
            ...FishingRodAttachment,
        },
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: true,
            isEquippable: true,
            isToolbar: true,
        },
        maxStack: 1,
        version: 1,
        model: 'prop_fishing_rod_01',
    },
    {
        name: 'Angelroute Expert',
        dbName: 'fishingrodexpert',
        icon: '/plugins/fishing-rods/fishingrod.png',
        data: {
            fishing: {
                maxWeight: 5.0, // KG
                successRate: 0.2,
                experiance: 0.5,
            },
            ...FishingRodAttachment,
        },
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: true,
            isEquippable: true,
            isToolbar: true,
        },
        maxStack: 1,
        version: 1,
        model: 'prop_fishing_rod_01',
    },
];
