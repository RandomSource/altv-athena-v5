export type PauseMenuToWebview = 'pause-menu-set-config';
export type PauseMenuToClient = 'pause-menu-invoke-event' | 'pause-menu-close';
export const PauseMenuEvents = {
    ToServer: {
        InvokeEvent: 'pause-menu-invoke-event',
    },
    Default: {
        quit: 'pause-quit',
        map: 'pause-map',
        options: 'pause-options',
    },
};
