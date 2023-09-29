import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

//Athena.commands.register('cmd', '/cmd - desc', ['admin'], async (player: alt.Player) => {});
Athena.commands.register(
    'createhouse',
    '/createhouse - Erstellt ein Basis Haus an der aktuellen Position',
    ['admin'],
    async (player: alt.Player) => {},
);
Athena.commands.register(
    'edithouse',
    '/edithouse [Preis/Status(Lock)/Schloss(0,1,auf,zu)/Owner(Privat,Staat,Firma)] [Wert]- Verwaltet das nächste Haus in der Umgebung',
    ['admin'],
    async (player: alt.Player, type: string, value: string) => {},
);

Athena.commands.register('/freehouse', '/freehouse - desc', ['admin'], async (player: alt.Player) => {});
