<template>
  <div :class="['rounded-window-frame', { maximized: isMaximized }]">
    <div class="window-titlebar">
      <div class="title">{{ title }}</div>
      <div class="controls">
        <div class="button minimize codicon codicon-chrome-minimize" @click="windowMinimize"></div>
        <div class="button max-restore codicon" :class="{
          'codicon-chrome-restore': isMaximized,
          'codicon-chrome-maximize': !isMaximized,
        }" @click="windowMaxRestore"></div>
        <div class="button close codicon codicon-chrome-close" @click="windowClose"></div>
      </div>
    </div>
    <div class="container">
      <slot>客户区域</slot>
    </div>
  </div>
</template>

<script setup>
// icons by https://github.com/microsoft/vscode-codicons
import '@vscode/codicons/dist/codicon.css';
import { watch, computed } from 'vue';
import store from '#/store/state.js';

const ipcRenderer = window.electron ? window.electron.ipcRenderer : null;

defineProps({
  title: {
    type: String,
    default: 'Win32Titlebar',
  },
});

const isMaximized = computed(() => store.state.cache?.window?.maximized || false);

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
.rounded-window-frame {
  position: fixed;
  left: 8px;
  top: 8px;
  height: calc(100% - 18px);
  width: calc(100% - 18px);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.6);
  border-radius: var(--window-border-radius);
  background: var(--color-background);

  .window-titlebar {
    color: var(--color-text);
    display: flex;
    align-items: center;
    height: 32px;
    -webkit-app-region: drag;
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
        -webkit-app-region: no-drag;

        &:hover {
          background: var(--hover);
        }

        &:active {
          background: var(--active);
        }

        &.close {
          border-top-right-radius: var(--window-border-radius);

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
    border-bottom-left-radius: var(--window-border-radius);
    border-bottom-right-radius: var(--window-border-radius);
    overflow: hidden;
  }

  &.maximized {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    box-shadow: none;
    border-radius: 0;

    .window-titlebar .controls .close {
      border-top-right-radius: 0;
    }
  }
}

[data-theme='dark'] .window-titlebar  {
  --hover: #191919;
  --active: #333333;
}
</style>
