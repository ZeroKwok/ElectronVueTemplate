<template>
    <component :is="windowFrameComponent" :title="title">
        <div class="container">
            <div class="content">
                <div class="icon" v-if="iconComponent">
                    <component :is="iconComponent" :style="{ color: iconColor }" />
                </div>

                <div class="text">
                    <slot>{{ message }}</slot>
                </div>
            </div>

            <div class="spacer"></div>

            <div class="footer">
                <el-button class="button" v-for="(btn, index) in buttons" :key="index" 
                    :type="btn.type || ''" :plain="btn.plain || false" :round="btn.round || false" 
                    @click="handleButtonClick(btn)">
                    {{ btn.text }}
                </el-button>
            </div>
        </div>
    </component>
</template>


<script setup>
import { ref, computed, defineAsyncComponent, defineComponent } from 'vue'
import i18n from '@/i18n';
import store from '@/common/state';
const windowFrameComponent = computed(() => {
    return (store.state.settings?.roundedWindow || false)
        ? defineAsyncComponent(() => import('@/components/RoundedWindowFrame.vue'))
        : defineAsyncComponent(() => import('@/components/WindowFrame.vue'))
});

import {
    CircleCheckFilled,
    CircleCloseFilled,
    WarningFilled,
    InfoFilled,
    QuestionFilled
} from '@element-plus/icons-vue'

// 图标和颜色计算
const iconMap = {
    success: CircleCheckFilled,
    warning: WarningFilled,
    info: InfoFilled,
    error: CircleCloseFilled,
    question: QuestionFilled
}

const colorMap = {
    success: '#67c23a',
    warning: '#e6a23c',
    info: '#909399',
    error: '#f56c6c',
    question: '#409eff'
}

const type = ref('info');
const title = ref('');
const message = ref('');
const buttons = ref([
    {
        key: 'no',
        text: 'No',
        type: '',
        plain: false
    },
    {
        key: 'yes',
        text: 'Yes',
        type: 'primary',
        plain: false
    },
]);

const iconComponent = computed(() => iconMap[type.value])
const iconColor = computed(() => colorMap[type.value])
const ipcRenderer = window.electron.ipcRenderer;

let dialogWinId = null;
const handleButtonClick = (btn) => {
    if (dialogWinId == null)
        return;
    ipcRenderer.send(`dialog-close-${dialogWinId}`, JSON.parse(JSON.stringify(btn)))
};

const initDialog = (options) => {
    console.log('dialog-init', options);

    dialogWinId = options.winId;
    type.value = options?.type || 'info';
    title.value = options?.title;
    message.value = options?.message;

    const buttons = [];
    const defaults = {
        type: '',
        plain: false
    };

    const primaryBtns = ['yes', 'ok', 'confirm'];

    for (const [key, value] of Object.entries(options.buttons)) {
        if (typeof value === 'string') {
            buttons.push({
                ...defaults,
                key: key,
                text: value,
                type: primaryBtns.includes(key) ? 'primary' : ''
            });
        } else if (typeof value === 'object') {
            buttons.push({
                ...defaults,
                key: key,
                text: value.text || value,
                type: primaryBtns.includes(key) ? 'primary' : '',
                ...value,
            });
        }
    }

    buttons.value = buttons;
};

ipcRenderer.invoke('dialog-inited', {}).then((result) => {
    if (result) {
        initDialog(result);
    }
});
</script>

<style lang="scss" scoped>
.container {
    height: 100%;

    padding: 1rem;
    display: grid;
    grid-template-rows: auto minmax(10px, 40px) auto;

    .content {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 1rem;

        .icon svg {
            width: 5em;
            height: 5em;
        }
    }

    .footer {
        display: flex;
        justify-content: end;

        .button {
            min-width: 5rem;
        }
    }
}
</style>
