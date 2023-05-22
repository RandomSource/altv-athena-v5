import { BaseItem } from '@AthenaShared/interfaces/item';
import { FishDropTable } from '../dropTable';

// Generates Fish Items based on the Picture & Picture Name
// Need to be refactor with custom weights ...
export function generateFishItems() {
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
        version: 1,
    };

    const newFishItems = [];
    for (let fishInfo of FishDropTable) {
        const newTemplate = { ...template };
        newTemplate.name = fishInfo.dbName.charAt(0).toUpperCase() + fishInfo.dbName.slice(1);
        newTemplate.dbName = fishInfo.dbName.toLowerCase();
        newTemplate.icon = `/plugins/fish-icons/${fishInfo.dbName.toLowerCase().toLowerCase()}.png`;
        newTemplate.weight = 1;
        newFishItems.push(newTemplate);
    }

    return newFishItems;
}
