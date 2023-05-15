<template>
    <div class="page-wrap">
        <div class="pause-screen">
            <div class="pause-logo">
                <img :src="ResolvePath(pauseImage)" />
            </div>
            <div class="pause-text">
                {{ pauseText }}
            </div>
            <div class="options">
                <div
                    class="option"
                    v-for="(option, index) in options"
                    :key="index"
                    :class="getHoverClass(index)"
                    @click="invokeOption(option.eventName, option.isServer)"
                    @hover="hover"
                >
                    {{ option.text }}
                </div>
                <div class="spacer"></div>
                <div
                    v-if="lastOption"
                    class="option"
                    :class="getHoverClass(options.length)"
                    @click="invokeOption(lastOption.eventName, lastOption.isServer)"
                    @hover="hover"
                >
                    {{ lastOption.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import WebViewEvents from '@ViewUtility/webViewEvents';
import { EventInfo, PauseConfig, PauseConfigType } from '../shared/config';
import { PauseMenuToClient, PauseMenuToWebview } from '../shared/events';
import ResolvePath from '@ViewUtility/pathResolver';

export const ComponentName = 'PauseMenu';
export default defineComponent({
    name: ComponentName,
    components: {
        Icon: defineAsyncComponent(() => import('@components/Icon.vue')),
    },
    data() {
        return {
            optionIndex: 0,
            pauseImage: 'alt' in window ? '' : PauseConfig.get<string>('pauseImage'),
            pauseText: 'alt' in window ? '' : PauseConfig.get<string>('pauseText'),
            options: 'alt' in window ? [] : PauseConfig.get<Array<EventInfo>>('options'),
            lastOption: 'alt' in window ? undefined : PauseConfig.get<EventInfo>('lastOption'),
        };
    },
    methods: {
        ResolvePath,
        handleConfig(config: PauseConfigType) {
            Object.keys(config).forEach((key) => {
                this[key] = config[key];
            });
        },
        getHoverClass(index: number) {
            const classes = {};

            if (index === this.optionIndex) {
                classes['option-hovered'] = true;
            }

            return classes;
        },
        invokeOption(eventName: string, isServer: boolean) {
            if (!('alt' in window)) {
                console.log(`Invoking Event Name: ${eventName}`);
                return;
            }

            WebViewEvents.emitClient<PauseMenuToClient>('pause-menu-invoke-event', eventName, isServer);
        },
        hover() {
            WebViewEvents.playSoundFrontend('HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
        },
        handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'ArrowUp' || e.key === 'w') {
                this.optionIndex -= 1;
                if (this.optionIndex < 0) {
                    this.optionIndex = 0;
                    return;
                }

                WebViewEvents.playSoundFrontend('HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                return;
            }

            if (e.key === 'ArrowDown' || e.key === 's') {
                this.optionIndex += 1;
                if (this.optionIndex > this.options.length) {
                    this.optionIndex = this.options.length;
                    return;
                }

                WebViewEvents.playSoundFrontend('HIGHLIGHT_NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
                return;
            }

            if (e.key === 'Enter' || e.key === 'd') {
                const eventName =
                    this.optionIndex === this.options.length
                        ? this.lastOption.eventName
                        : this.options[this.optionIndex].eventName;

                const isServer =
                    this.optionIndex === this.options.length
                        ? this.lastOption.isServer
                        : this.options[this.optionIndex].isServer;

                this.invokeOption(eventName, isServer);
                WebViewEvents.playSoundFrontend('SELECT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            }

            if (e.key === 'Escape') {
                WebViewEvents.emitClient<PauseMenuToClient>('pause-menu-close');
                WebViewEvents.playSoundFrontend('EXIT', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
            }
        },
    },
    mounted() {
        document.addEventListener('keyup', this.handleKeyPress);
        WebViewEvents.on<PauseMenuToWebview>('pause-menu-set-config', this.handleConfig);
        WebViewEvents.emitReady(ComponentName);
        WebViewEvents.playSoundFrontend('LEADER_BOARD', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
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

.pause-screen {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    border-right: 6px solid rgba(0, 0, 0, 0.2);
    min-width: 20vw;
    min-height: 100%;
    max-height: 100%;
    overflow: hidden;
    justify-content: flex-start;
    align-items: center;
    padding: 12px;
    box-sizing: border-box;
    flex-direction: column;
}

.pause-logo {
    min-width: 150px;
    max-width: 150px;
    min-height: 150px;
    max-height: 150px;
}

.pause-logo img {
    width: 100%;
    height: 100%;
}

.pause-text {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 48px;
    font-weight: 600;
    letter-spacing: 0.05em;
}

.options {
    display: flex;
    font-size: 16px;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    flex-grow: 1;
}

.spacer {
    flex-grow: 1;
    width: 100%;
}

.option {
    margin-bottom: 24px;
    transition: all 0.2s;
}

.option:hover,
.option-hovered {
    cursor: pointer;
    transform: scale(1.05);
    color: rgba(0, 225, 255, 0.75);
}
</style>
