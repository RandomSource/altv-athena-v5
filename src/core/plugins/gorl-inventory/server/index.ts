import * as Athena from '@AthenaServer/api';
import * as alt from 'alt-server';
import { InventoryView } from './src/view';

const PLUGIN_NAME = 'inventory-gorl';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    const includePlugin = Athena.systems.plugins.getPlugins().includes('core-inventory');
    if (includePlugin) {
        alt.logError('[PLUGIN] Disable the default core-inventory Plugin!');
        return;
    }
    InventoryView.init();
});
