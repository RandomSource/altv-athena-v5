import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { fishingItems } from './items/items';
import { equip, unequip, checkToEquip, checkToUnequip } from './fishingRod';
import { FishingEvents } from '../shared/events';
import { tryFishing } from './fishing';

const PLUGIN_NAME = 'fishing';

async function init() {
    // Initialize Base Items
    for (let baseItem of fishingItems) {
        await Athena.systems.inventory.factory.upsertAsync(baseItem);
    }

    Athena.player.events.on('item-equipped', equip);
    Athena.player.events.on('item-unequipped', unequip);
    Athena.player.events.on('selected-character', checkToEquip);
    Athena.systems.inventory.events.on('onDrop', checkToUnequip);
    alt.onClient(FishingEvents.fromClient.try, tryFishing);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, init);

// Interface for FishingEffect
interface FishingEffect {
    successRate: number;
    experience: number;
    weightage: number;
}

// Angelrouten -> key ist der Item dbName !
const fishingRods: { [key: string]: FishingEffect } = {
    fishingrodbasic: { successRate: -0.1, experience: 5, weightage: 0.8 },
    fishingrodmid: { successRate: 0, experience: 10, weightage: 1 },
    fishingrodexpert: { successRate: 0.2, experience: 20, weightage: 1.5 },
};

// Angelschnüre -> key ist der Item dbName !
const fishingLines: { [key: string]: FishingEffect } = {
    fishinglinebasic: { successRate: -0.05, experience: -5, weightage: 0.8 },
    fishinglinemid: { successRate: 0.05, experience: 5, weightage: 1 },
    fishinglineexpert: { successRate: 0.1, experience: 10, weightage: 1.2 },
};

// Köder -> key ist der Item dbName !
const baits: { [key: string]: FishingEffect } = {
    fishingbaitbasic: { successRate: 0, experience: 0, weightage: 1 },
    fishingbaitmid: { successRate: 0.1, experience: 5, weightage: 1.2 },
    fishingbaitexpert: { successRate: 0.2, experience: 10, weightage: 1.5 },
};

// Fish types with required parameters, success rates, and weight ranges
const fishTypes: {
    [key: string]: {
        rod: string;
        line: string;
        bait: string;
        successRate: number;
        minWeight: number;
        maxWeight: number;
    };
} = {
    bass: {
        rod: 'fishingrodbasic',
        line: 'fishinglinebasic',
        bait: 'fishingbaitbasic',
        successRate: 0.6,
        minWeight: 0.5,
        maxWeight: 2,
    },
    salmon: {
        rod: 'fishingrodmid',
        line: 'fishinglinemid',
        bait: 'fishingbaitmid',
        successRate: 0.9,
        minWeight: 2,
        maxWeight: 10,
    },
    trout: {
        rod: 'fishingrodexpert',
        line: 'fishinglineexpert',
        bait: 'fishingbaidexpert',
        successRate: 0.8,
        minWeight: 1,
        maxWeight: 5,
    },
};

// Calculate success rate and weight range based on parameters
function calculateSuccessRateAndWeight(
    fishingRod: string,
    fishingLine: string,
    selectedBait: string,
    playerExperience: { successRate: number; experience: number },
    fishType: string,
): { successRate: number; minWeight: number; maxWeight: number } {
    const requiredRod = fishTypes[fishType]?.rod;
    const requiredLine = fishTypes[fishType]?.line;
    const requiredBait = fishTypes[fishType]?.bait;
    const fishSuccessRate = fishTypes[fishType]?.successRate ?? 0;
    const fishMinWeight = fishTypes[fishType]?.minWeight ?? 0;
    const fishMaxWeight = fishTypes[fishType]?.maxWeight ?? 0;

    const rodBonus = fishingRods[fishingRod]?.successRate ?? 0;
    const lineBonus = fishingLines[fishingLine]?.successRate ?? 0;
    const baitBonus = baits[selectedBait]?.successRate ?? 0;
    const playerBonus = playerExperience.successRate;

    let successRate = rodBonus + lineBonus + baitBonus + playerBonus + fishSuccessRate;

    // Apply additional success rate bonus if using the correct parameters for the fish type
    if (fishingRod === requiredRod && fishingLine === requiredLine && selectedBait === requiredBait) {
        successRate += 0.2;
    }

    const rodWeightage = fishingRods[fishingRod]?.weightage ?? 1;
    const lineWeightage = fishingLines[fishingLine]?.weightage ?? 1;
    const baitWeightage = baits[selectedBait]?.weightage ?? 1;
    const totalWeightage = rodWeightage * lineWeightage * baitWeightage;

    const adjustedMinWeight = fishMinWeight * totalWeightage;
    const adjustedMaxWeight = fishMaxWeight * totalWeightage;

    return { successRate, minWeight: adjustedMinWeight, maxWeight: adjustedMaxWeight };
}

// Example usage
const fishingRod = 'normalRod';
const fishingLine = 'normalLine';
const selectedBait = 'normalBait';
const playerExperience = {
    successRate: 0.05,
    experience: 10,
};
const fishType = 'trout';

const { successRate, minWeight, maxWeight } = calculateSuccessRateAndWeight(
    fishingRod,
    fishingLine,
    selectedBait,
    playerExperience,
    fishType,
);
alt.log('Success Rate:', successRate);
alt.log('Weight Range:', minWeight, 'to', maxWeight);
