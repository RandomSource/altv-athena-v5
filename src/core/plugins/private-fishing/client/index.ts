import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api';
import * as native from 'natives';
import { FishingEvents } from '../shared/events';

const LETTER_E = 69;

let hasStarted = false;
let isPaused = false;
let interval: number;
let finalTime: number;
let startTime: number;
let nextAnimationCheckTime = Date.now() + 1000;
let lastKnownFwdPosition: alt.Vector3;

function isFacingWater() {
    if (!lastKnownFwdPosition) {
        return false;
    }

    const up = lastKnownFwdPosition.add(0, 0, 2);
    const down = lastKnownFwdPosition.sub(0, 0, 5);
    const [didPass, intersection] = native.testProbeAgainstWater(up.x, up.y, up.z, down.x, down.y, down.z);
    return didPass;
}

function handleKey(keycode: number) {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (keycode !== LETTER_E) {
        return;
    }

    if (alt.isMenuOpen()) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    if (!isFacingWater()) {
        return;
    }

    alt.emitServer(FishingEvents.fromClient.try);
}

/**
 * Calculate scale based on time.
 
 * @return {number}
 */
function getScale(): number {
    const value = (1 - (Date.now() - startTime) / finalTime) * 3;

    if (value <= 0) {
        return 0;
    }

    return value;
}

/**
 * Returns a 0-255 value
 *
 * @return {number}
 */
function getColorByScale(): number {
    const value = ((Date.now() - startTime) / finalTime) * 255;

    if (value < 150) {
        return 150;
    }

    if (value >= 255) {
        return 255;
    }

    return value;
}

function checkForAnimation() {
    if (Date.now() < nextAnimationCheckTime) {
        return;
    }

    nextAnimationCheckTime = Date.now() + 1000;
    const isReeling = native.isEntityPlayingAnim(
        alt.Player.local.scriptID,
        'amb@world_human_stand_fishing@idle_a',
        'idle_c',
        3,
    );

    if (isReeling) {
        return;
    }

    native.taskPlayAnim(
        alt.Player.local.scriptID,
        'amb@world_human_stand_fishing@idle_a',
        'idle_c',
        1,
        -1,
        6000,
        129,
        1,
        false,
        false,
        false,
    );
}

async function tick() {
    if (alt.Player.local.vehicle) {
        return;
    }

    if (alt.isMenuOpen()) {
        return;
    }

    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    let fwdPosition = AthenaClient.utility.vector.getVectorInFrontOfPlayer(alt.Player.local, 10).sub(0, 0, 1);
    let circlePosition = fwdPosition;
    const [didFind, height] = native.getWaterHeight(fwdPosition.x, fwdPosition.y, fwdPosition.z);
    if (height > -10) {
        circlePosition = new alt.Vector3(fwdPosition.x, fwdPosition.y, height + 0.1);
        fwdPosition = circlePosition;
    }

    lastKnownFwdPosition = fwdPosition;

    if (!isFacingWater()) {
        return;
    }

    if (finalTime && startTime) {
        checkForAnimation();

        const scale = getScale();
        const colorValue = getColorByScale();
        AthenaClient.screen.marker.drawSimple(
            23,
            circlePosition,
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(scale, scale, 1),
            new alt.RGBA(colorValue, colorValue, colorValue, colorValue),
            false,
        );
    } else {
        AthenaClient.screen.marker.drawSimple(
            0,
            fwdPosition,
            new alt.Vector3(0, 0, 0),
            new alt.Vector3(0.2, 0.2, 0.2),
            new alt.RGBA(255, 255, 255, 50),
            false,
        );

        AthenaClient.screen.text.drawText3D('E', fwdPosition.add(0, 0, 1), 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

async function start() {
    if (hasStarted) {
        return;
    }

    native.requestAnimDict('amb@world_human_stand_fishing@idle_a');
    await alt.Utils.waitFor(() => native.hasAnimDictLoaded('amb@world_human_stand_fishing@idle_a'));

    interval = alt.setInterval(tick, 0);
    alt.on('keydown', handleKey);
    hasStarted = true;
}

function next(timeUntilZero: number) {
    isPaused = false;
    startTime = Date.now();
    finalTime = timeUntilZero;
}

function pause() {
    isPaused = true;
    finalTime = undefined;
    startTime = undefined;
}

function stop() {
    hasStarted = false;
    alt.off('keydown', handleKey);
    alt.clearInterval(interval);
    interval = undefined;
}

alt.onServer(FishingEvents.toClient.start, start);
alt.onServer(FishingEvents.toClient.next, next);
alt.onServer(FishingEvents.toClient.stop, stop);
alt.onServer(FishingEvents.toClient.pause, pause);
