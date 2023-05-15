import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { PauseMenuEventHandler } from '../shared/eventHandler';
import { PauseMenuEvents } from '../shared/events';

const PLUGIN_NAME = 'pause-menu';

function handleEvent(player: alt.Player, eventName: string) {
    const callback = PauseMenuEventHandler.callbacks.get<(player: alt.Player) => void>(eventName);
    if (typeof callback === 'undefined') {
        return;
    }

    callback(player);
}

function onLoad() {
    alt.onClient(PauseMenuEvents.ToServer.InvokeEvent, handleEvent);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, onLoad);
