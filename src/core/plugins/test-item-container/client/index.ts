import * as alt from 'alt-client';
import * as Athena from '@AthenaClient/api';
import { InventoryView } from '@AthenaPlugins/core-inventory/server/src/view';

Athena.webview.on('container-storage-open', (player: alt.Player) => {
    alt.logError('ClientWebview: yoa dat geyt ');
});
alt.onServer('container-storage-open', (player: alt.Player) => {
    alt.logError('Client: yoa dat geyt');
});
