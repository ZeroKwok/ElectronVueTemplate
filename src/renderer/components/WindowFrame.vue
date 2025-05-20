<template>
  <div class="window-frame">
    <div class="window-titlebar">
       <div class="title">{{ title }}</div>
       <div class="controls">
         <div v-if="resizable"
             class="button minimize codicon codicon-chrome-minimize"
             @click="windowMinimize"
         ></div>
         <div v-if="resizable"
             class="button max-restore codicon"
             :class="{
             'codicon-chrome-restore': isMaximized,
             'codicon-chrome-maximize': !isMaximized,
             }"
             @click="windowMaxRestore"
         ></div>
         <div
             class="button close codicon codicon-chrome-close"
             @click="windowClose"
         ></div>
       </div>
    </div>
    <div class="container">
      <slot>Client Area</slot>
    </div>
  </div>
</template>

<script setup>
// icons by https://github.com/microsoft/vscode-codicons
import '@vscode/codicons/dist/codicon.css';
import { computed } from 'vue';
import store from '@/common/state.js';

const ipcRenderer = window.electron ? window.electron.ipcRenderer : null;
const isMaximized = computed(() => store.state.shared?.window?.maximized || false);

defineProps({
  title: {
    type: String,
    default: 'Win32Titlebar',
  },
  resizable: {
    type: Boolean,
    default: true,
  },
});

function windowMinimize() {
  ipcRenderer?.send('minimize');
}

function windowMaxRestore() {
  ipcRenderer?.send('maximizeOrRestore');
}

function windowClose() {
  ipcRenderer?.send('close');
}
</script>

<style lang="scss" scoped>
.window-frame{
  border: 1px solid var(--color-border);
  height: 100%;
  background: var(--color-background);
  .window-titlebar {
    color: var(--color-text);
    display: flex;
    align-items: center;
    height: 32px;
    app-region: drag;
    user-select: none;
    --hover: #e6e6e6;
    --active: #cccccc;
    .title {
      padding: 8px 12px;
      font-size: 12px;
      font-family: 'Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', sans-serif;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .controls {
      height: 100%;
      margin-left: auto;
      justify-content: flex-end;
      align-items: start;
      display: flex;
      .button {
        height: 100%;
        width: 46px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        app-region: no-drag;
        &:hover {
          background: var(--hover);
        }
        &:active {
          background: var(--active);
        }
        &.close {
          &:hover {
            background: #c42c1b;
            color: rgba(255, 255, 255, 0.8);
          }
          &:active {
            background: #f1707a;
            color: #000;
          }
        }
      }
    }
  }
  .container {
    height: calc(100% - 32px);
    overflow: hidden;
  }
}

[data-theme='dark'] .window-titlebar  {
  --hover: #303030;
  --active: #454545;
}
</style>
