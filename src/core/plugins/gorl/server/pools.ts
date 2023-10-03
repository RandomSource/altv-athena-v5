/***
 * Global Server Pools that stores all kind of List exp. all Houses , Player Vehicles ...
 * Just thinking about it
 */

import { HOUSE_SETTINGS } from '@AthenaPlugins/core-housing/shared/config';
import { IHouse } from '@AthenaPlugins/core-housing/shared/interfaces/House';

export let ServerPools = {
    Houses: new Array<IHouse>(HOUSE_SETTINGS.MaxHouses + 1).fill(undefined),
};
