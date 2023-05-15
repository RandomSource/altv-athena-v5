export const FishingEvents = {
    toClient: {
        start: 'fishing:start',
        next: 'fishing:next',
        stop: 'fishing:stop',
        pause: 'fishing:pause',
    },
    rpc: {
        probeWater: 'fishing:probe:water',
    },
    fromClient: {
        try: 'fishing:try',
    },
};
