<template>
  <div class="window-frame">
    <div class="window-titlebar">
       <div class="title">{{ title }}</div>
       <div class="controls">
         <div
             class="button minimize codicon codicon-chrome-minimize"
             @click="windowMinimize"
         ></div>
         <div
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
      <slot>客户区域</slot>
    </div>
  </div>
</template>

<script>
// icons by https://github.com/microsoft/vscode-codicons
import '@vscode/codicons/dist/codicon.css';

const ipcRenderer =
  window.electron ? window.electron.ipcRenderer : null;

export default {
  name: 'Win32Titlebar',
  props: {
    title: {
      type: String,
      default: 'Win32Titlebar',
    },
  },
  data() {
    return {
      isMaximized: false,
    };
  },
  created() {
    if (ipcRenderer) {
      ipcRenderer.on('isMaximized', (_, value) => {
        this.isMaximized = value;
      });
    }
  },
  methods: {
    windowMinimize() {
      ipcRenderer.send('minimize');
    },
    windowMaxRestore() {
      ipcRenderer.send('maximizeOrRestore');
    },
    windowClose() {
      ipcRenderer.send('close');
    },
  },
};
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
  }
}

[data-theme='dark'] .window-titlebar  {
  --hover: #191919;
  --active: #333333;
}
</style>
