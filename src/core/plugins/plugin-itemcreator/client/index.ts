import * as alt from 'alt-client';
import * as Athena from '@AthenaClient/api';
import ViewModel from '@AthenaClient/models/viewModel';
import { ShopEvents } from '@AthenaPlugins/open-source-shop/shared/enums/ShopEvents';

const PAGE_NAME = 'ItemCreator';

class InternalFunctions implements ViewModel {
    static async open() {
        Athena.webview.setOverlayVisible(PAGE_NAME, false);

        Athena.webview.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        Athena.webview.openPages([PAGE_NAME], true, InternalFunctions.close);

        Athena.webview.focus();
        Athena.webview.showCursor(true);

        alt.toggleGameControls(false);

        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        Athena.webview.setOverlaysVisible(true);

        Athena.webview.closePages([PAGE_NAME]);
        Athena.webview.unfocus();
        Athena.webview.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {}
}

alt.on('keydown', (key: number) => {
    if (key === 'F'.charCodeAt(0)) {
        InternalFunctions.open();
    }
});
