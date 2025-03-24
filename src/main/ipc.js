import { app, dialog, ipcMain, BrowserWindow } from 'electron';
import cache from '../shared/store/cache'
import settings from '../shared/store/settings'

// 窗口操作相关的 IPC 处理
function handleWindowOperations() {
    ipcMain.on('minimize', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win) win.minimize();
    });

    ipcMain.on('maximizeOrRestore', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
    });

    ipcMain.on('close', e => {
        const win = BrowserWindow.fromWebContents(e.sender)
        if (win.id == cache.get("mainWindowId"))
            app.quit();
        else if (win)
            win.close();
    });
}

// 设置相关的 IPC 处理
function handleSettingsOperations() {
    ipcMain.handle('get', async (event, key, defaultValue) => {
        if (key == 'settings')
            return settings.get(key, defaultValue)
        else if (key == 'cache')
            return cache.get('shared', defaultValue);
        else
            console.log('Unknown key: ' + key);
        return defaultValue;
    });

    ipcMain.handle('set', async (event, key, value) => {
        try {
            if (key == 'settings')
                settings.set(key, value);
            else if (key == 'cache')
                cache.set('shared', value);
            else
                console.log('Unknown key: ' + key);
        } catch (e) {
            console.error(e);
        }
    });

    // 监听变化
    settings.onDidChange('settings', (newValue, oldValue) => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('changeed', 'settings', newValue);
        });
    });

    cache.on('set', (key, value, oldValue) => {
        if (key === 'shared') {
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('changeed', 'cache', newValue);
            });
        }
    });
}

function initIPC() {
    handleWindowOperations();
    handleSettingsOperations();
}

export default initIPC;
