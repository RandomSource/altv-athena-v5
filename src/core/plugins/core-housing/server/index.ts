import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import './src/commands/adminCommand';
import './src/House';
import { HouseController } from './src/House';

const PLUGIN_NAME = 'core-housing';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    HouseController.init();
    alt.log('Core Housing loading');
});
