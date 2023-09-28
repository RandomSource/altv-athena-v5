
import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

const PLUGIN_NAME = 'core-house';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
  alt.log('Hello World!');
});
