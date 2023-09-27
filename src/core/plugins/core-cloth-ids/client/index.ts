import { CLOTHING_CONFIG } from '@AthenaPlugins/core-clothing/shared/config';
import { CLOTHING_IDS_LIST, PROP_IDS_LIST } from '../shared/enums';
import * as alt from 'alt-client';
import * as native from 'natives';

function getMaxClothIds() {
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
                        }   > Difference:${diff}  ${sex === 0 ? 'Female' : 'Male'} | ComponentId: ${
                            CLOTHING_IDS_LIST[i]
                        } `,
                    );
                }
            }
            alt.logError(
                `[MAX-CLOTHING-ID] ${sex === 0 ? 'Female' : 'Male'} | ComponentId: ${
                    CLOTHING_IDS_LIST[i]
                } | Count:${id}`,
            );
        }
    }
    changes.forEach((x) => {
        alt.logWarning(x);
    });
    alt.logWarning('');
}

function getMaxPropIds() {
    const changes: Array<String> = ['Differences:'];
    for (let sex = 0; sex <= 1; sex++) {
        const model = sex === 0 ? alt.hash('mp_f_freemode_01') : alt.hash('mp_m_freemode_01');
        const ped = alt.Player.local;
        native.setPlayerModel(ped, model);
        for (let i = 0; i <= 13; i++) {
            const id = native.getNumberOfPedPropDrawableVariations(ped, i) - 1;
            if (CLOTHING_CONFIG.MAXIMUM_PROP_VALUES[sex][i] && CLOTHING_CONFIG.MAXIMUM_PROP_VALUES[sex][i] !== 0) {
                const diff = id - CLOTHING_CONFIG.MAXIMUM_PROP_VALUES[sex][i];
                if (diff > 0) {
                    changes.push(
                        `[MAX-PROP-ID]NewValue:${id} >  OldValue:${
                            CLOTHING_CONFIG.MAXIMUM_PROP_VALUES[sex][i]
                        }   > Difference:${diff}  ${sex === 0 ? 'Female' : 'Male'} | PropId: ${PROP_IDS_LIST[i]} `,
                    );
                }
            }
            alt.logError(`[MAX-PROP-ID] ${sex === 0 ? 'Female' : 'Male'} | PropId: ${PROP_IDS_LIST[i]} | Count:${id}`);
        }
    }
    changes.forEach((x) => {
        alt.logWarning(x);
    });
    alt.logWarning('');
}

alt.onServer('dev:getmaxids:cloth', getMaxClothIds);
alt.onServer('dev:getmaxids:props', getMaxPropIds);