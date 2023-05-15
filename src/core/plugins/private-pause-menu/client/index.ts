import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { PauseMenuEvents, PauseMenuToClient, PauseMenuToWebview } from '../shared/events';
import { EventInfo, PauseConfig, PauseConfigType } from '../shared/config';
import { PauseMenuEventHandler } from '../shared/eventHandler';

type CustomOption = EventInfo & { callback: Function };

let page: AthenaClient.webview.Page;
let nextCamRemoval = Date.now() + 3000;
let customOptions: Array<CustomOption> = [];

const Internal = {
    init() {
        // Build the Pause Menu Page
        page = new AthenaClient.webview.Page({
            name: 'PauseMenu',
            callbacks: {
                onClose: Internal.onClose,
                onReady: Internal.onReady,
            },
            options: {
                disableEscapeKey: true,
                onOpen: {
                    blurBackground: true,
                    disableControls: 'all',
                    disablePauseMenu: true,
                    focus: true,
                    hideHud: true,
                    hideOverlays: true,
                    setIsMenuOpenToTrue: true,
                    showCursor: true,
                },
                onClose: {
                    enableControls: true,
                    enablePauseMenu: true,
                    hideCursor: true,
                    setIsMenuOpenToFalse: true,
                    showHud: true,
                    showOverlays: true,
                    unblurBackground: true,
                    unfocus: true,
                },
            },
        });

        // Disable Escape Menu
        alt.setInterval(Internal.tick, 0);

        // Create Bindings
        AthenaClient.webview.on<PauseMenuToClient>('pause-menu-invoke-event', Internal.handleInvoke);
        AthenaClient.webview.on<PauseMenuToClient>('pause-menu-close', () => {
            page.close(true);
        });

        // Create Default Options
        PauseMenuEventHandler.callbacks.add(PauseMenuEvents.Default.map, Internal.map);
        PauseMenuEventHandler.callbacks.add(PauseMenuEvents.Default.quit, Internal.quit);
        PauseMenuEventHandler.callbacks.add(PauseMenuEvents.Default.options, Internal.options);
    },
    tick() {
        if (Date.now() > nextCamRemoval) {
            native.invalidateIdleCam();
            native.invalidateCinematicVehicleIdleMode();
            nextCamRemoval = Date.now() + 3000;
        }

        if (!AthenaClient.webview.isDoneUpdating()) {
            return;
        }

        if (native.isPauseMenuActive()) {
            return;
        }

        native.disableControlAction(0, 177, true);
        native.disableControlAction(0, 199, true);
        native.disableControlAction(0, 200, true);
        native.disableControlAction(0, 202, true);
        native.disableControlAction(0, 322, true);

        if (!native.isDisabledControlJustReleased(0, 200) && !native.isDisabledControlJustReleased(0, 199)) {
            return;
        }

        const isAnyMenuOpen = AthenaClient.webview.isAnyMenuOpen();
        const customPauseOpen = AthenaClient.webview.isPageOpen('PauseMenu');

        if (isAnyMenuOpen || customPauseOpen) {
            return;
        }

        page.open();
    },
    onReady() {
        alt.setWatermarkPosition(0);

        const config: PauseConfigType = {
            pauseImage: PauseConfig.get<string>('pauseImage'),
            pauseText: PauseConfig.get<string>('pauseText'),
            lastOption: PauseConfig.get<EventInfo>('lastOption'),
            options: JSON.parse(JSON.stringify(PauseConfig.get<Array<EventInfo>>('options').concat(customOptions))),
        };

        AthenaClient.webview.emit<PauseMenuToWebview>('pause-menu-set-config', config);
    },
    onClose() {
        alt.setWatermarkPosition(4);
    },
    async handleInvoke(eventName: string, isServer: boolean) {
        page.close(true);
        await alt.Utils.wait(300);

        const index = customOptions.findIndex((x) => x.eventName === eventName);

        if (index >= 0) {
            customOptions[index].callback();
            return;
        }

        if (isServer) {
            alt.emitServer(PauseMenuEvents.ToServer.InvokeEvent, eventName);
            return;
        }

        const cb = PauseMenuEventHandler.callbacks.get(eventName);
        cb();
    },
    quit() {
        native.quitGame();
    },
    options() {
        native.activateFrontendMenu(alt.hash('FE_MENU_VERSION_LANDING_MENU'), false, -1);
    },
    async map() {
        native.activateFrontendMenu(alt.hash('FE_MENU_VERSION_MP_PAUSE'), false, Number(0));
        await alt.Utils.waitFor(() => {
            return native.getPauseMenuState() === 15;
        }, 300);

        native.pauseMenuceptionGoDeeper(Number(-1));
    },
};

export const PrivatePauseMenu = {
    forceOpen() {
        if (!page) {
            return;
        }

        page.open();
    },
    options: {
        /**
         * Add a custom menu option callback to the Pause Menu.
         *
         * @param {EventInfo} option
         * @param {Function} callback
         */
        add(option: EventInfo, callback: Function) {
            customOptions.push({ ...option, callback });
        },
        /**
         * Remove a custom menu option by evetnNAme
         *
         * @param {string} eventName
         * @return {*}
         */
        remove(eventName: string) {
            const index = customOptions.findIndex((x) => x.eventName === eventName);
            if (index <= -1) {
                return;
            }

            customOptions.splice(index, 1);
        },
        /**
         * Replace all entries of custom options with the specified array.
         *
         * @param {(Array<EventInfo & { callback: Function }>)} options
         */
        set(options: Array<EventInfo & { callback: Function }>) {
            customOptions = options;
        },
        /**
         * Reset all entries of custom options.
         */
        reset() {
            customOptions = [];
        },
    },
};

onTicksStart.add(Internal.init);

// PrivatePauseMenu.options.add({ eventName: 'my-custom-option', text: 'Custom Option!' }, () => {
//     console.log('~y~INVOKED!!!');
// });
