import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import fs from 'fs';
import path from 'path';

Athena.systems.plugins.registerPlugin('item-creator', () => {
    alt.log(`~lg~Item Creator successfully loaded.`);
});

const currentPath = path.join(process.cwd(), '/src/core/plugins/itemcreator/server/config/items.ts');

alt.onClient('item-creator:generate-file', (player: alt.Player, output: string) => {
    try {
        const modifiedOutput = output.replace(/["']itemCreatorBehavior["']/g, 'itemCreatorBehavior');
        fs.writeFileSync(currentPath, modifiedOutput);
        console.log(`File "items.ts" written successfully.`);
    } catch (e) {
        console.log(`Error Generating File.`);
        return;
    }
});
