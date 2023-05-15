import { PauseMenuEvents } from "./events";

const PLUGIN_FOLDER_NAME = 'private-pause-menu';

export type EventInfo = { eventName: string; text: string; isServer?: boolean };

export interface PauseConfigType {
    pauseImage: string;
    pauseText: string;
    options: Array<EventInfo>;
    lastOption: EventInfo;
}

// Do not directly change, use the API
const InternalConfig: PauseConfigType = {
    pauseImage: `@plugins/images/${PLUGIN_FOLDER_NAME}/logo.png`,
    pauseText: 'Athena Framework',
    options: [
        { eventName: PauseMenuEvents.Default.map, text: 'Map', isServer: false },
        { eventName: PauseMenuEvents.Default.options, text: 'Options', isServer: false },
    ],
    lastOption: {
        eventName: PauseMenuEvents.Default.quit,
        text: 'Exit Game',
        isServer: false,
    },
};

function set(key: 'lastOption', value: EventInfo);
function set(key: 'options', value: Array<EventInfo>);
function set(key: 'pauseText', value: string);
function set(key: 'pauseImage', value: string);
function set(key: keyof typeof InternalConfig, value: any) {
    InternalConfig[key] = value;
}

export const PauseConfig = {
    set,
    get<T = unknown>(key: keyof typeof InternalConfig): T {
        return InternalConfig[key] as T;
    },
};
