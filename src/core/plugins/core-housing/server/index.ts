import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import './src/commands/adminCommand';

const PLUGIN_NAME = 'core-housing';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    alt.log('Core Housing loading');
});
