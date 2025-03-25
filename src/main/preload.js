// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const context = {
  env: {
    NODE_ENV: process.env.NODE_ENV,
    IS_ELECTRON: true,
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI );
    contextBridge.exposeInMainWorld('context', context);
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.context = context
}