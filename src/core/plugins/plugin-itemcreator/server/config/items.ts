import { BaseItem } from '@AthenaShared/interfaces/item';

const itemCreatorBehavior = { canDrop: true, canStack: true };
const itemCreatorArray: Array<BaseItem> = [
    {
        name: 'Beer',
        dbName: 'item-creator-beer',
        behavior: itemCreatorBehavior,
        icon: '@AthenaPlugins/icons/Item-Creator/Beer',
        data: {
            test: 123,
        },
        consumableEventToCall: 'example-event',
        maxStack: 64,
    },
];
