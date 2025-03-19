import { app, dialog, ipcMain, BrowserWindow } from 'electron';
import cache from '../shared/store/cache'
import settings from '../shared/store/settings'

function initIPC() {
    ipcMain.on('minimize', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win)
            win.minimize();
    });

    ipcMain.on('maximizeOrRestore', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win)
            win.isMaximized() ? win.unmaximize() : win.maximize();
    });

    ipcMain.on('close', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win.id == cache.get("mainWindowId"))
            app.quit();
        else if (win)
            win.close();
    });

    ipcMain.on('close', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win.id == cache.get("mainWindowId"))
            app.quit();
        else if (win)
            win.close();
    });

    ipcMain.handle('getSetting', async (event, defaultValue) => {
        return settings.get('settings', defaultValue)
    });

    let shouldEmit = true;
    ipcMain.handle('setSetting', async (event, value) => {
        shouldEmit = false;
        try {
            settings.set('settings', value);
        } finally {
            shouldEmit = true;
        }
    });

    settings.onDidChange('settings', (newValue, oldValue) => {
        if (shouldEmit) {
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('settingsChangeed', newValue);
            });
        }
    });
};

export default initIPC;
