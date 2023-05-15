<template>
    <div class="page-wrap">
        <div class="menu-screen">
            <div class="header">keybinds</div>
            <div class="keybind-header">
                <span>description</span>
                <span>mod</span>
                <span>default</span>
                <span>key</span>
            </div>
            <div class="keybind-list">
                <div class="keybind">
                    <span class="description">alt:V Console</span>
                    <span class="key">none</span>
                    <span class="key">~</span>
                    <span class="key">~</span>
                </div>

                <div class="keybind" v-for="(keyInfo, index) in list" :key="index">
                    <span class="description">{{ trimDescription(keyInfo.description) }}</span>
                    <span class="key">{{ keyInfo.modifier ? keyInfo.modifier : 'none' }}</span>
                    <span class="key">{{ getKeyCode(keyInfo.default) }}</span>
                    <span class="key-custom" @mouseover="hover" @click="modify(keyInfo.identifier, keyInfo.key)">
                        {{ getKeyCode(keyInfo.key) }}
                    </span>
                </div>
            </div>
        </div>
        <div class="modify-key-wrap" v-if="keyToModify">
            <div class="modify-key-window">
                <span>Press any key to change... (Escape to Cancel)</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '@ViewUtility/webViewEvents';
import ResolvePath from '@ViewUtility/pathResolver';
import { KeybindMenuEvents } from '../shared/events';
import { HotkeyInfo } from '../shared/interfaces';
import { KeyCodes } from '@AthenaShared/utility/keyCodes';

export const ComponentName = 'KeybindMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            list: [] as HotkeyInfo[],
            keyToModify: undefined as { identifier: string; key: number },
        };
    },
    methods: {
        ResolvePath,
        getKeyCode(key: string | number) {
            return KeyCodes[key] ? KeyCodes[key].toUpperCase() : 'unknown';
        },
        trimDescription(desc: string) {
            if (desc.length >= 64) {
                return desc.slice(0, 64) + '...';
            }

            return desc;
        },
        handleKeyPress(e: KeyboardEvent) {
            const keyCode = e.keyCode;

            // escape
            if (keyCode === 27) {
                if (this.keyToModify) {
                    this.keyToModify = undefined;
                    return;
                }

                WebViewEvents.emitClient<KeybindMenuEvents>('keybind-close-menu');
                return;
            }

            console.log('updating...');
            console.log(keyCode);
            const identifier = this.keyToModify.identifier;
            const key = keyCode;
            this.keyToModify = undefined;
            WebViewEvents.emitClient<KeybindMenuEvents>('update-keybind', identifier, key);
        },
        updateKeybindList(list: HotkeyInfo[]) {
            this.list = list;
        },
        hover() {
            WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        modify(identifier: string, key: number) {
            WebViewEvents.playSoundFrontend('CONTINUE', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            this.keyToModify = {
                identifier,
                key,
            };
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handleKeyPress);
        WebViewEvents.on<KeybindMenuEvents>('update-keybind-list', this.updateKeybindList);
        WebViewEvents.emitReady(ComponentName);
        WebViewEvents.playSoundFrontend('LEADER_BOARD', 'HUD_FRONTEND_DEFAULT_SOUNDSET');

        if ('alt' in window) {
            return;
        }

        this.updateKeybindList([
            {
                key: 69, // E
                default: 69,
                description: 'testing',
                identifier: 'testing-key',
                modifier: undefined,
            },
            {
                key: 70, // F
                default: 70,
                description: 'testing again',
                identifier: 'testing-key-2',
                modifier: 'shift',
            },
        ]);

        this.modify('testing-key', 69);
    },
    unmounted() {
        document.removeEventListener('keyup', this.handleKeyPress);
    },
});
</script>

<style scoped>
.page-wrap {
    color: white;
    font-size: 24px;
    animation: 0.2s ease-in;
    animation-name: fadein;
}

@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.menu-screen {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    border: 12px solid rgba(0, 0, 0, 0.2);
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100%;
    max-height: 100%;
    overflow: hidden;
    justify-content: flex-start;
    box-sizing: border-box;
    flex-direction: column;
    padding: 36px;
}

.header {
    font-size: 36px;
    font-weight: 600;
    letter-spacing: 0.1em;
    min-height: 65px;
    max-height: 65px;
    box-sizing: border-box;
    opacity: 0.75;
    font-variant: small-caps;
}

.keybind-list {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 215px);
    max-height: calc(100vh - 215px);
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 12px;
    align-items: center;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
}

.keybind {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    width: 100%;
    margin-bottom: 12px;
    box-sizing: border-box;
}

.keybind-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr;
    width: 100%;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding: 12px;
    box-sizing: border-box;
    text-align: left;
    font-variant: small-caps;
    letter-spacing: 0.1em;
    opacity: 0.5;
}

.description {
    text-align: left;
    font-size: 16px;
    align-self: center;
}

.key {
    align-self: center;
    font-size: 14px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.2);
    width: 100px;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 4px;
}

.key-custom {
    align-self: center;
    font-size: 14px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    width: 100px;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 4px;
    transition: all 0.1s;
}

.key-custom:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.5);
}

.key-custom:active {
    transform: scale(0.95);
}

.modify-key-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.5);
}

.modify-key-window {
    padding: 24px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background: filter(blur);
}
</style>
