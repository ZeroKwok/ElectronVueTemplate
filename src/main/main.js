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
import NativeDialog from './ndialog.js';

const gotTheLock = app.requestSingleInstanceLock();

// 1. Handle creating/removing shortcuts on Windows when installing/uninstalling.
// 2. On Windows, if the app is already running, we don't want to start a new instance.
if (started || !gotTheLock) {
  logger.info('exiting, because another instance is running or it is a squirrel startup event');
  logger.info(' - SquirrelStarted:', started);
  logger.info(' - SingleInstanceLock:', gotTheLock);
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
    minWidth: 450,
    minHeight: 300,
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

  // Listen to the window close event
  mainWindow.on('close', async (event) => {
    event.preventDefault();
    try {
      const result = await new NativeDialog().show(mainWindow, {
        file: 'src/renderer/electron/NativeMessageBox.html',
        title: pkg.productName,
        rawHtml: '<p style="font-weight: bold; color: #409EFF;">Are you sure you want to exit?</p>',
        buttons: { no: 'No', yes: 'Yes' },
        modal: true,
      });

      if (result.value === 'yes') {
        mainWindow.destroy();
      }
    }
    catch (e) {
      logger.error('Error:', e);
      mainWindow.destroy();
    }
  });

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

app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
  // Print out data received from the second instance.
  logger.info('The second instance has running, data: ', additionalData)

  // Someone tried to run a second instance, we should focus our window.
  const win = cache.get("mainWindow")
  if (win) {
    if (win.isMinimized()) win.restore()
      win.focus()
  }
});

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

  updater.on('update-downloaded', async (event, releaseNotes, releaseName) => {
    logger.info('Update downloaded:', releaseName, releaseNotes);

    try {
      const detail = process.platform === 'win32' ? releaseName : releaseNotes;
      const result = await new NativeDialog().show(
        cache.get("mainWindow", null),
        {
          type: 'info',
          file: 'src/renderer/electron/NativeMessageBox.html',
          title: 'Application Update',
          message: `A new version has been downloaded. Restart the application to apply the updates.\n${detail}`,
          buttons: { no: 'Later', yes: 'Restart' },
          modal: true,
        });

      if (result.value === 'yes') {
        logger.info('Restarting application.');
        updater.quitAndInstall();
      }
    }
    catch (e) {
      logger.error('Error:', e);
    }
  });
}