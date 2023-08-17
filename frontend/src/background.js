'use strict'

import { app, ipcMain, protocol, BrowserWindow, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const Store = require('electron-store');
const store = new Store();
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win

async function createWindow() {
    // Create the browser window.
    const windowSettings = store.get('windowSettings')
    let width = 1790
    let height = 534
    let x, y
    if (windowSettings) {
        width = windowSettings.width
        height = windowSettings.height
        x = windowSettings.x
        y = windowSettings.y
    } else {
        store.set('windowsSettings', {width, height})
    }
    win = new BrowserWindow({
        width,
        height,
        x, y,
        icon: 'C:\\Users\\scronheim\\projects\\dark-electrea\\frontend\\src\\assets\\icon.png',
        resizable: true,
        frame: false,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
        }
    })

    win.setMenuBarVisibility(false)
    const appIcon = new Tray('C:\\Users\\scronheim\\projects\\dark-electrea\\frontend\\src\\assets\\icon.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Показать мои поездки', click: function () {
                win.show();
            }
        },
        {
            label: 'Выйти', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    appIcon.setContextMenu(contextMenu)

    win.on('move', (event) => {
        store.set('windowSettings', event.sender.getBounds())
    })

    win.on('resize', (event) => {
        store.set('windowSettings', event.sender.getBounds())
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

ipcMain.handle('get-user-settings', () => {
    return store.get('userSettings')
})

ipcMain.handle('close-window', () => {
    app.quit()
})

ipcMain.handle('minimize-window', () => {
    win.minimize()
})

ipcMain.handle('maximize-window', () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
})


ipcMain.handle('get-user-company', () => {
    return store.get('userCompany')
})

ipcMain.on('save-user-settings', (e, data) => {
    store.set('userSettings', data)
})

ipcMain.on('save-user-company', (e, data) => {
    store.set('userCompany', data)
})

app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
