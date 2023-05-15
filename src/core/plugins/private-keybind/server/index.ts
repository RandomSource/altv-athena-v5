import * as Athena from '@AthenaServer/api';

const PLUGIN_NAME = 'keybind-menu';

function onLoad() {
    // Do nothing; server-side just needs to exist.
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, onLoad);
