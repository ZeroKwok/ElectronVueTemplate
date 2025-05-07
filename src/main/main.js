import { app, session, BrowserWindow, dialog } from 'electron';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import initIPC from './ipc';
import settings from '../shared/store/settings'
import cache from '../shared/store/cache'
import windowStateKeeper from '../shared/utils/window-state.js';
import updater from './updater.js';
import { getPackage } from '../shared/utils/package.js';
import { logger } from './logger.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

logger.info('');
logger.info('Starting application...');
logger.info(' - OS:', os.platform(), os.release(), os.arch(), os.cpus()[0].model);
logger.info(' - APP:', app.getName(), app.getVersion());
logger.info(' - Node:', process.versions.node);
logger.info(' - Electron:', process.versions.electron);
logger.info(' - Chrome:', process.versions.chrome);
logger.info(' - NODE_ENV:', process.env.NODE_ENV);
logger.debug(' - Environment:', process.env);

const pkg = getPackage();
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
    icon: path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/assets/icon.png`),
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

  // Cache the mainWindow
  cache.set("mainWindow", mainWindow)

  // Listen to the window maximize event
  mainWindow.on('maximize', () => {
    cache.set("shared.window.maximized", true);
  });
  mainWindow.on('unmaximize', () => {
    cache.set("shared.window.maximized", false);
  });
  cache.set("shared.window.maximized", mainWindow.isMaximized());

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Load the Vue DevTools if it exists
    // https://www.electronjs.org/zh/docs/latest/tutorial/devtools-extension
    const devtools = path.resolve('plugin/vue.js-devtools/7.7.0_0');
    if (fs.existsSync(devtools))
      session.defaultSession.loadExtension(devtools);
  }
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
  os: {
    name: os.hostname(),
    type: os.type(),
    arch: os.arch(),
    release: os.release(),
    platform: os.platform(),
  },
  app: {
    name: app.getName(),
    version: app.getVersion(),
    locales: locales,
    packaged: app.isPackaged,
  },
  versions: {...process.versions}
});
// Initialize the auto updater in production mode, otherwise it will throw an error
// when trying to check for updates in development mode.
if (process.env.NODE_ENV !== 'development') {
  // recommend: 
  // `${pkg.urls.update}/${process.platform}/${process.arch}/${app.getVersion()}`
  updater.init(`${pkg.urls.update}/${process.platform}/${process.arch}`, {});
  updater.start();
  updater.on('error', (err) => {
    logger.error('Updater error:', err);
  });

  updater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    logger.info('Update downloaded:', releaseName, releaseNotes);

    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Starta om applikationen för att verkställa uppdateringarna.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        logger.info('Restarting application.');
        updater.quitAndInstall()
      }
    })
  })
}