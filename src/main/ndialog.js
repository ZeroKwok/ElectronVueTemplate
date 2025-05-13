const path = require('path');
const { BrowserWindow, ipcMain } = require('electron')

class NativeDialog {
    constructor() {
        this._win = null;
        this._result = null;
        this._resolved = false;
    }

    show(parent, options = {}) {
        return new Promise((resolve, reject) => {
            if (this._win) {
                reject();
                return;
            }

            options.window = options?.window || {};
            options.window.title = options?.window?.title || options?.title;

            this._win = new BrowserWindow({
                width: 450,
                height: 200,
                parent: parent,
                modal: false,
                show: false,
                frame: false,
                resizable: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    webSecurity: true,
                    preload: path.join(__dirname, 'preload.js')
                },
                ...options?.window
            });

            if (options.url)
                this._win.loadURL(options.url);
            else
                this._win.loadFile(options.file);

            this._win.once('ready-to-show', () => {
                this._win.show();

                 // 这个事件, 可能在脚本没有执行完成时被触发, 因此这里延迟下执行
                setTimeout(() => {
                    this._win.webContents.send('dialog-init', { ...options, winId: this._win.id });
                }, 30);
            });

            this._win.on('closed', () => {
                ipcMain.removeAllListeners(`dialog-close-${this._win.id}`);

                this._win = null;
                if (!this._resolved)
                    resolve(this._result = { value: 'closed' });
            });

            ipcMain.once(`dialog-close-${this._win.id}`, (event, btn) => {
                resolve(this._result = { value: btn.key });
                this._resolved = true;

                if (this._win) {
                    this._win.destroy()
                    this._win = null;
                }
            });
        });
    }
};

export default NativeDialog;
