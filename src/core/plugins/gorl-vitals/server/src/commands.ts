import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { VITAL_NAMES } from '../../shared/enums';
import { VitalsSystem } from './system';

Athena.systems.messenger.commands.register(
    'setfood',
    '/setvital [Hunger/Thirst/Pee/Shit/Wash] [Wert(0-100)]',
    ['admin'],
    setFoodCommand,
);
Athena.systems.messenger.commands.register(
    'setwater',
    '/setvital [Hunger/Thirst/Pee/Shit/Wash] [Wert(0-100)]',
    ['admin'],
    setWaterCommand,
);
Athena.systems.messenger.commands.register(
    'setvital',
    '/setvital [Hunger/Thirst/Pee/Shit/Wash] [Wert(0-100)]',
    ['admin'],
    setVitalCommand,
);
function setFoodCommand(player: alt.Player, commandValue: string) {
    setVitalCommand(player, 'hunger', commandValue);
}
function setWaterCommand(player: alt.Player, commandValue: string) {
    setVitalCommand(player, 'thirst', commandValue);
}
function setVitalCommand(player: alt.Player, vitalValue: string, commandValue: string) {
    let value = parseInt(commandValue);
    let vital: VITAL_NAMES;
    switch (vitalValue.toLocaleLowerCase()) {
        case 'hunger':
            vital = VITAL_NAMES.HUNGER;
            break;
        case 'pinkeln':
        case 'pissen':
        case 'pee':
        case 'urin':
            vital = VITAL_NAMES.PEE;
            break;
        case 'shit':
            vital = VITAL_NAMES.SHIT;
            break;
        case 'thirst':
            vital = VITAL_NAMES.THIRST;
            break;
        case 'wash':
            vital = VITAL_NAMES.WASH;
            break;
    }
    if (isNaN(value)) {
        Athena.player.emit.message(player, 'Ungültiger Wert!');
        return;
    }

    value = VitalsSystem.normalizeVital(value);
    VitalsSystem.adjustVital(player, vital, value, true);
}
