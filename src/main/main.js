import { app, session, BrowserWindow } from 'electron';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import initIPC from './ipc';
import settings from '../shared/store/settings'
import cache from '../shared/store/cache'
import windowStateKeeper from '../shared/utils/window-state.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {

  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: false,
    transparent: true,
    resizable: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindowState.manage(mainWindow);

  // Hide menu bar on Microsoft Windows and Linux
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Cache the mainWindow id
  cache.set("mainWindowId", mainWindow.id)

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Load the Vue DevTools if it exists
  // https://www.electronjs.org/zh/docs/latest/tutorial/devtools-extension
  const devtools = path.resolve('plugin/vue.js-devtools/7.7.0_0');
  if (fs.existsSync(devtools))
    session.defaultSession.loadExtension(devtools);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // Initialize the Main IPC
  initIPC();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Set the shared cache
const locales = app.isPackaged ? `${process.resourcesPath}/locales` : './locales';

cache.set('shared', {
  locales: locales,
  isPackaged: app.isPackaged,
});