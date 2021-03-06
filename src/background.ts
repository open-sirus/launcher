import type { Tray } from 'electron'
import { app, BrowserWindow, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { autoUpdater } from 'electron-updater'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

import { DownloadManager, setDownloadManager } from '@/services/DownloadManager'
import { init as initClientActions } from '@/background/ClientActions'
import { initTray } from '@/background/tray'

import { IS_DEVELOPMENT } from './constants'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow, tray: Tray

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 680,
    minWidth: 1024,
    minHeight: 680,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: Boolean(
        (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean
      ),
      contextIsolation: false,
      webviewTag: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
    useContentSize: true,
    frame: false,
  })

  win.removeMenu()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }

  tray = initTray(win)
  setDownloadManager(new DownloadManager(win))
  initClientActions()
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    tray.destroy()
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (IS_DEVELOPMENT) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (error) {
      console.error('Vue Devtools failed to install:', error.toString())
    }
  }

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (IS_DEVELOPMENT) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        tray.destroy()
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      tray.destroy()
      app.quit()
    })
  }
}
