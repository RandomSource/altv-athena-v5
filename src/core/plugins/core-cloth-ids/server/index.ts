import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

const PLUGIN_NAME = 'ClothingMaxIDs';

if (Athena.utility.config.isDevMode()) {
    Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
        alt.log(`~lg~[DEV] ==> ${PLUGIN_NAME} was Loaded`);
    });

    Athena.commands.register(
        'getmaxids',
        '/getmaxids [Cloth/Props] - Verwende hierfür nicht deinen HauptCharakter!',
        ['admin'],
        (player: alt.Player, type: string) => {
            if (!type) return;
            if (type.toLowerCase() === 'props' || type.toLowerCase() === 'cloth') {
                player.emit(`dev:getmaxids:${type.toLowerCase()}`);
            }
        },
    );
} else {
    alt.logError(`${PLUGIN_NAME} works only in dev mode!`);
}

/*class CharTestCommand {
     ('dlccloth', '/dlccloth [ComponentID] [Drawable] [Texture] - Add DLC Cloth as Test', PERMISSIONS.NONE)
    private static dlc(player: alt.Player, id: number, drawable: number, texture: number, dlcName: string) {
        player.setDlcClothes(alt.hash(dlcName), id, drawable, texture, 2);
    }
    @command('cloth', '/cloth [ComponentID] [Drawable] [Texture] - Add Cloth as Test', PERMISSIONS.NONE)
    private static cloth(player: alt.Player, id: number, drawable: number, texture: number, dlcName: string) {
        player.setClothes(id, drawable, texture, 2);
    }
    @command(['maxclothidall', 'mciall'], '/mciall - Verwende hierfür nicht deinen HauptCharakter!', PERMISSIONS.NONE)
    private static maxclothidall(player: alt.Player) {
        player.emit('dev:getmaxclothid:all');
    }
}*/
