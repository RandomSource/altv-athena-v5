import * as Athena from '@AthenaServer/api';
import { StoredItem } from '@AthenaShared/interfaces/item';
import { ItemDrop } from '@AthenaServer/systems/dropTable';

export const FishDropTable: ItemDrop[] = [
    {
        dbName: 'cod',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 12 },
    },
    {
        dbName: 'goldfish',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 8 },
    },
    {
        dbName: 'salmon',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 12 },
    },
    {
        dbName: 'sardine',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 4 },
    },
    {
        dbName: 'swordfish',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 128 },
    },
    {
        dbName: 'trout',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 32 },
    },
    {
        dbName: 'tuna',
        amountMin: 1,
        amountMax: 1,
        frequency: { numerator: 1, denominator: 128 },
    },
];

export function getDrop(): Omit<StoredItem, 'data' | 'slot'> | undefined {
    const list = Athena.systems.dropTable.get(FishDropTable, 1);
    return list.length >= 1 ? list[0] : undefined;
}
