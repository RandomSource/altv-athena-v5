import * as Athena from '@AthenaClient/api';
import { RPCEventNames } from '@AthenaPlugins/gorl/shared/enums/rpcEventNames';
import * as alt from 'alt-client';
import * as natives from 'natives';

Athena.systems.rpc.on(RPCEventNames.getStreetName, () => {
    const pos = alt.Player.local.pos;
    const streetHash = natives.getStreetNameAtCoord(pos.x, pos.y, pos.z);
    const streetName = natives.getStreetNameFromHashKey(streetHash[1]);
    return streetName;
});
