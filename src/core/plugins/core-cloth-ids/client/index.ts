import { CLOTHING_CONFIG } from '@AthenaPlugins/athena-plugin-clothing/shared/config';
import { CLOTHING_IDS } from '@AthenaPlugins/athena-plugin-clothing/shared/enums';
import * as alt from 'alt-client';
import * as native from 'natives';

function getMaxClothIdAll() {
    const changes: Array<String> = ['Differences:'];
    for (let sex = 0; sex <= 1; sex++) {
        const model = sex === 0 ? alt.hash('mp_f_freemode_01') : alt.hash('mp_m_freemode_01');
        const ped = alt.Player.local;
        native.setPlayerModel(ped, model);
        for (let i = 0; i < 12; i++) {
            const id = native.getNumberOfPedDrawableVariations(ped, i) - 1;
            if (
                CLOTHING_CONFIG.MAXIMUM_COMPONENT_VALUES[sex][i] &&
                CLOTHING_CONFIG.MAXIMUM_COMPONENT_VALUES[sex][i] !== 0
            ) {
                const diff = id - CLOTHING_CONFIG.MAXIMUM_COMPONENT_VALUES[sex][i];
                if (diff > 0) {
                    changes.push(
                        `[MAX-CLOTHING-ID]NewValue:${id} >  OldValue:${
                            CLOTHING_CONFIG.MAXIMUM_COMPONENT_VALUES[sex][i]
                        }   > Difference:${diff}  ${sex === 0 ? 'Female' : 'Male'} | ComponentId: ${CLOTHING_IDS[i]} `,
                    );
                }
            }
            alt.logError(
                `[MAX-CLOTHING-ID] ${sex === 0 ? 'Female' : 'Male'} | ComponentId: ${CLOTHING_IDS[i]} | Count:${id}`,
            );
        }
    }
    changes.forEach((x) => {
        alt.logWarning(x);
    });
    alt.logWarning('');
}

alt.onServer('dev:getmaxclothid:all', getMaxClothIdAll);
