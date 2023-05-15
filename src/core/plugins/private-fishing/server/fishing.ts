import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { FishingEvents } from '../shared/events';
import { getDrop } from './dropTable';

interface FishingInfo {
    phase: number;

    /**
     * Score is calculated as follows:
     *
     * ```
     * (startTime + times[x]) - Date.now() = score
     * ```
     *
     * The final score means that the closer you are to the final time, the higher your score.
     *
     * @type {number}
     * @memberof FishingInfo
     */
    score: number;

    /**
     * When an invoke is started.
     *
     * @type {[number, number, number]}
     * @memberof FishingInfo
     */
    startTime: number;

    /**
     * Calculate 3x Random Times
     *
     * @type {[number, number, number]}
     * @memberof FishingInfo
     */
    times: [number, number, number];
}

const SessionKey = 'fishing-session';
const threshold = 1000;
const minValue = 500;
const maxValue = 6000;

declare global {
    namespace AthenaSession {
        export interface Player {
            [SessionKey]: FishingInfo;
        }
    }
}

// phase 0 - Start the process, increment to 1
// phase 1 - Invoke to try and catch fish, pass 1st random number
// phase 2 - Invoke to try and catch fish, pass 2nd random number
// phase 3 - Invoke to try and catch fish, pass 3rd random number
// phase 4 - Do not invoke,

export async function tryFishing(player: alt.Player) {
    const invokeTime = Date.now();
    let fishingInfo = Athena.session.player.get(player, SessionKey);
    if (!fishingInfo) {
        fishingInfo = {
            phase: 1,
            score: 0,
            startTime: Date.now(),
            times: [
                Athena.utility.random.randomNumberBetween(minValue, maxValue),
                Athena.utility.random.randomNumberBetween(minValue, maxValue),
                Athena.utility.random.randomNumberBetween(minValue, maxValue),
            ],
        };

        Athena.player.emit.soundFrontend(player, 'FocusIn', 'HintCamSounds');
    } else {
        const timeToAdd = fishingInfo.times[fishingInfo.phase - 1];
        let result = 0;

        if (fishingInfo.startTime + timeToAdd > Date.now()) {
            result = invokeTime - fishingInfo.startTime;
            fishingInfo.score += result;
            Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else {
            Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }

        fishingInfo.phase += 1;
        fishingInfo.startTime = Date.now();
    }

    Athena.session.player.set(player, SessionKey, fishingInfo);

    if (fishingInfo.phase >= 1 && fishingInfo.phase <= 3) {
        if (fishingInfo.phase === 1) {
            Athena.player.emit.notification(player, 'Press "E" again when the circle is at its smallest.');
        }

        player.emit(FishingEvents.toClient.next, fishingInfo.times[fishingInfo.phase - 1]);
        return;
    }

    if (fishingInfo.phase <= 3) {
        return;
    }

    Athena.session.player.clearKey(player, SessionKey);
    player.emit(FishingEvents.toClient.pause);

    let maxScore = 0;
    for (let maxValue of fishingInfo.times) {
        maxScore += maxValue;
    }

    if (fishingInfo.score < maxScore - threshold) {
        Athena.player.emit.notification(player, `Fish swam away...`);
        Athena.player.emit.soundFrontend(player, 'LOOSE_MATCH', 'HUD_MINI_GAME_SOUNDSET');
        return;
    }

    const itemDrop = getDrop();
    if (!itemDrop) {
        Athena.player.emit.notification(player, `Fish swam away...`);
        Athena.player.emit.soundFrontend(player, 'LOOSE_MATCH', 'HUD_MINI_GAME_SOUNDSET');
        return;
    }

    const didAdd = await Athena.player.inventory.add(player, { ...itemDrop, data: {} });
    if (!didAdd) {
        Athena.player.emit.notification(player, `Inventory is full or weight exceeded...`);
        return;
    }

    Athena.player.emit.soundFrontend(player, 'FIRST_PLACE', 'HUD_MINI_GAME_SOUNDSET');
    Athena.player.emit.createCredits(player, {
        role: 'Caught',
        name: itemDrop.dbName.charAt(0).toUpperCase() + itemDrop.dbName.slice(1),
        duration: 2000,
    });
}
