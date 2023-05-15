import IAttachable from '@AthenaShared/interfaces/iAttachable';
import { BaseItem } from '@AthenaShared/interfaces/item';
import { FishDropTable } from './dropTable';

const FishingRodAttachment: IAttachable = {
    model: 'prop_fishing_rod_01',
    pos: {
        x: -6.938893903907228e-18,
        y: -0.039999999999999994,
        z: 0.16,
    },
    rot: { x: -6.938893903907228e-18, y: -0.32, z: 0.18 },
    bone: 58,
};

function generateFish() {
    const template: BaseItem = {
        name: '',
        dbName: '',
        icon: '',
        data: {},
        behavior: {
            canDrop: true,
            canStack: true,
            canTrade: true,
            isEquippable: false,
            isToolbar: false,
        },
        maxStack: 5,
        model: 'xm3_prop_xm3_package_01a',
    };

    const newFishItems = [];
    for (let fishInfo of FishDropTable) {
        const newTemplate = { ...template };
        newTemplate.name = fishInfo.dbName.charAt(0).toUpperCase() + fishInfo.dbName.slice(1);
        newTemplate.dbName = fishInfo.dbName.toLowerCase();
        newTemplate.icon = `/plugins/fishing-icons/${fishInfo.dbName.toLowerCase().toLowerCase()}.png`;
        newTemplate.weight = 1;
        newFishItems.push(newTemplate);
    }

    return newFishItems;
}

export const baseItems: Array<BaseItem> = [
    {
        name: 'Fishing Rod',
        dbName: 'fishingrod',
        icon: '/plugins/fishing-icons/fishingrod.png',
        data: FishingRodAttachment,
        behavior: {
            canDrop: true,
            canStack: false,
            canTrade: true,
            isEquippable: true,
            isToolbar: true,
        },
        maxStack: 1,
        model: 'prop_fishing_rod_01',
    },
    ...generateFish(),
];
