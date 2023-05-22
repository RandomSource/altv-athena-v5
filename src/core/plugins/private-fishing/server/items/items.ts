import { BaseItem } from '@AthenaShared/interfaces/item';
import { generateFishItems } from './fishes';
import { fishingRods } from './fishrods';

export const fishingItems: Array<BaseItem> = [...fishingRods, ...generateFishItems()];
