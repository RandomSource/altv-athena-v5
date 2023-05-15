import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { Page } from '@AthenaClient/webview/page';
import * as AthenaClient from '@AthenaClient/api';
import { KeybindMenuEvents } from '../shared/events';
import { PrivatePauseMenu } from '@AthenaPlugins/private-pause-menu/client';
import { HotkeyInfo } from '../shared/interfaces';

let page: Page;

const Internal = {
    init() {
        // Build the Pause Menu Page
        page = new AthenaClient.webview.Page({
            name: 'KeybindMenu',
            callbacks: {
                onClose: Internal.onClose,
                onReady: Internal.onReady,
            },
            options: {
                disableEscapeKey: false,
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

        AthenaClient.webview.on<KeybindMenuEvents>('update-keybind', Internal.handleKeybindUpdate);
        AthenaClient.webview.on<KeybindMenuEvents>('keybind-close-menu', () => {
            page.close(true);
        });

        PrivatePauseMenu.options.add({ eventName: 'update-keybind-menu', text: 'Keybinds', isServer: false }, () => {
            page.open();
        });
    },
    onReady() {
        const initialKeys = AthenaClient.systems.hotkeys.hotkeys().filter((x) => x.doNotAllowRebind !== true);
        const hotkeys: HotkeyInfo[] = initialKeys.map((x) => {
            return {
                key: x.key,
                default: x.default,
                description: x.description,
                identifier: x.identifier,
                modifier: x.modifier,
            };
        });

        AthenaClient.webview.emit<KeybindMenuEvents>('update-keybind-list', hotkeys);
    },
    onClose() {
        PrivatePauseMenu.forceOpen();
    },
    handleKeybindUpdate(identifier: string, keyCode: number) {
        AthenaClient.systems.hotkeys.rebind(identifier, keyCode);
        Internal.onReady();
    },
};

onTicksStart.add(Internal.init);
