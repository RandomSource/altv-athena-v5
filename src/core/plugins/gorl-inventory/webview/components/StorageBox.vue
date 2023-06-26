<template>
    <div class="title">
        <p>yoa</p>
    </div>
    <div class="inventory-frame" :style="calcMaxHeightOnSlotCount" v-if="custom && Array.isArray(custom)">
        <div class="inventory-slots-max">
            <Slot
                v-for="(slot, index) in maxSlots"
                class="slot"
                :class="getSelectedItemClass('custom', index)"
                :key="index"
                :id="getID('custom', index)"
                :info="getSlotInfo('custom', index)"
                @mouseenter="updateDescriptor('custom', index)"
                @mouseleave="updateDescriptor(undefined, undefined)"
                @mousedown="(e) => drag(e, { endDrag, canBeDragged: hasItem('custom', index), singleClick, startDrag })"
            >
                <template v-slot:image v-if="hasItem('custom', index)">
                    <img :src="getImagePath(getItem('custom', index))" />
                </template>
                <template v-slot:index v-else>
                    <template v-if="config.showGridNumbers">
                        {{ slot }}
                    </template>
                </template>
            </Slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import { Item } from '@AthenaShared/interfaces/item';
import { makeDraggable } from '@ViewUtility/drag';
import WebViewEvents from '@ViewUtility/webViewEvents';
import { INVENTORY_EVENTS } from '../../shared/events';
import { getImagePath } from '../utility/inventoryIcon';
import { INVENTORY_CONFIG } from '../../shared/config';
import { debounceReady } from '../utility/debounce';
import { DualSlotInfo, InventoryType } from '@AthenaPlugins/gorl-inventory/shared/interfaces';
import { SlotInfo } from '../utility/slotInfo';

export default defineComponent({
    name: 'StorageBox',
    components: {
        Slot: defineAsyncComponent(() => import('./Slot.vue')),
    },
    props: {
        maxWidth: {
            type: Number,
            default: 90,
        },
        maxHeight: {
            type: Number,
            default: 90,
        },
        maxSlots: {
            type: Number,
            default: 10,
        },
        custom: {
            type: Array<Item>,
        },
    },
    data() {
        return {
            splitData: undefined as { name: string; slot: number; quantity: number },
            giveData: undefined as { name: string; slot: number; quantity: number },
            config: {
                units: INVENTORY_CONFIG.WEBVIEW.WEIGHT.UNITS,
                showGridNumbers: INVENTORY_CONFIG.WEBVIEW.GRID.SHOW_NUMBERS,
                showToolbarNumbers: INVENTORY_CONFIG.WEBVIEW.TOOLBAR.SHOW_NUMBERS,
                isWeightEnabled: true,
                maxWeight: 64,
            },
        };
    },
    methods: {
        getImagePath,
        drag: makeDraggable,

        updateDescriptor(type: InventoryType, index: number) {
            if (typeof type === 'undefined') {
                this.itemName = '';
                this.itemDescription = '';
                return;
            }

            const item = this.getItem(type, index);
            if (!item) {
                this.itemName = '';
                this.itemDescription = '';
                return;
            }

            this.itemName = item.name;
            this.itemDescription = item.description;
        },
        startDrag() {
            this.itemSingleClick = undefined;
        },
        singleClick(type: InventoryType, index: number) {
            if (typeof this.itemSingleClick !== 'undefined') {
                // Ignore same inventory slot
                if (this.itemSingleClick.type === type && this.itemSingleClick.index === index) {
                    return;
                }

                // Ignore inventory types that do not match.
                // Combining should be done inside of inventory only.
                if (this.itemSingleClick.type !== type) {
                    return;
                }

                if (!('alt' in window)) {
                    const secondItem = `${type}-${index}`;
                    const firstItem = `${this.itemSingleClick.type}-${this.itemSingleClick.index}`;
                    console.log(`Combine Event:`, firstItem, secondItem);
                    this.itemSingleClick = undefined;
                    return;
                }

                const info: DualSlotInfo = {
                    startType: this.itemSingleClick.type,
                    startIndex: this.itemSingleClick.index,
                    endType: type,
                    endIndex: index,
                };

                WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.COMBINE, info);

                this.itemSingleClick = undefined;
                return;
            }

            this.itemSingleClick = { type, index };
        },
        endDrag(startType: InventoryType, startIndex: number, endType: InventoryType, endIndex: number) {
            if (!('alt' in window)) {
                console.log(`Should Perform SWAP or Stack of items.`);
                console.log(startType, startIndex);
                console.log(endType, endIndex);
                return;
            }

            if (!debounceReady()) {
                return;
            }

            // Call server-side swap / stack
            WebViewEvents.playSound(`@plugins/sounds/${INVENTORY_CONFIG.PLUGIN_FOLDER_NAME}/inv_move.ogg`, 0.2);
            const info: DualSlotInfo = {
                startType,
                startIndex,
                endType,
                endIndex,
            };

            WebViewEvents.emitServer(INVENTORY_EVENTS.TO_SERVER.SWAP, info);
        },
        getSlotInfo(type: InventoryType, slot: number): SlotInfo {
            const defaultTemplate: SlotInfo = {
                location: type,
                hasItem: false,
                name: undefined,
                quantity: 0,
                totalWeight: 0,
                highlight: false,
                slot,
            };

            if (typeof this[type] === undefined) {
                return defaultTemplate;
            }

            const items = [...this[type]] as Array<Item>;
            const itemIndex = items.findIndex((item) => item && item.slot === slot);

            if (itemIndex <= -1) {
                return defaultTemplate;
            }

            const item = items[itemIndex];
            if (typeof item === 'undefined') {
                return defaultTemplate;
            }

            defaultTemplate.hasItem = true;
            defaultTemplate.highlight = item.isEquipped;
            defaultTemplate.name = item.name;
            defaultTemplate.quantity = item.quantity;
            defaultTemplate.totalWeight = typeof item.totalWeight === 'number' ? item.totalWeight : 0;
            return defaultTemplate;
        },
        /**
         * Determines if a specific data type has a matching slot item.
         * @param type
         * @param slot
         */
        hasItem(type: InventoryType, slot: number): boolean {
            if (typeof this[type] === undefined) {
                return false;
            }

            const items = [...this[type]] as Array<Item>;
            return items.findIndex((item) => item && item.slot === slot) !== -1;
        },
        getItem(type: InventoryType, slot: number): Item | undefined {
            if (typeof this[type] === undefined) {
                return undefined;
            }

            const items = [...this[type]] as Array<Item>;
            return items[items.findIndex((item) => item && item.slot === slot)];
        },
        getSelectedItemClass(type: InventoryType, index: number) {
            if (typeof this.itemSingleClick === 'undefined') {
                return {};
            }

            if (this.itemSingleClick.type !== type || this.itemSingleClick.index !== index) {
                return {};
            }

            return { 'item-outline': true };
        },
        getID(type: InventoryType, index: number): string {
            return type + '-' + index;
        },
    },
    mounted() {},
    computed: {
        calcMaxHeightOnSlotCount() {
            let style = '';
            let height = 0;
            const borderSize = 2; // Border Size is 2px
            const marginSize = 5; // Margin Size is 5px
            const rows = this.maxSlots / 5; // 5 Slots per Row
            if (rows <= 1) {
                height = 90;
            } else {
                height = 90 * rows;
                height += rows * borderSize; //
                height += rows * marginSize; // Margin Count * Margin Size
                height += 5; // patting- top
            }
            style += `height: ${height}px`;
            return style;
        },
    },
});
</script>
<style scoped>
.inventory-frame {
    background: rgba(0, 0, 0, 0.75);
    min-width: 505px;
    max-width: 505px;
    min-height: 105px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    height: 100%;
    align-self: flex-start;
    position: relative;
    overflow: hidden;
    scrollbar-width: none;
}
::-webkit-scrollbar {
    display: block;
}
.inventory-frame .inventory-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    min-height: 106px;
    max-height: 106px;
}

.inventory-toolbar .slot {
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.inventory-slots-max {
    display: flex;
    flex-flow: row wrap;
    box-sizing: border-box;
    overflow-y: scroll;
    justify-content: space-evenly;
    align-content: flex-start;
    height: 100%;
    padding-top: 5px;
}

.inventory-slots .slot,
.inventory-slots-max .slot {
    margin-bottom: 5px;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}
</style>
