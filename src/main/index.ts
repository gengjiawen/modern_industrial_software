import { app, shell, BrowserWindow, ipcMain, Menu, type MenuItemConstructorOptions } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import creatWorker from './excel_worker?nodeWorker'

let settingsWindow: BrowserWindow | null = null

function loadRenderer(window: BrowserWindow, hash?: string): void {
  // Load dev server URL in development, otherwise load packaged HTML.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const url = new URL(process.env['ELECTRON_RENDERER_URL'])
    if (hash) url.hash = hash.startsWith('#') ? hash : `#${hash}`
    window.loadURL(url.toString())
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), hash ? { hash } : undefined)
  }
}

function createMainWindow(): void {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadRenderer(window)
}

function openSettingsWindow(): void {
  if (settingsWindow) {
    settingsWindow.show()
    settingsWindow.focus()
    return
  }

  const window = new BrowserWindow({
    width: 860,
    height: 600,
    show: false,
    title: 'Settings',
    autoHideMenuBar: process.platform !== 'darwin',
    ...(process.platform === 'linux' ? { icon } : {}),
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hiddenInset' as const } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  settingsWindow = window

  window.on('ready-to-show', () => {
    window.show()
  })

  window.on('closed', () => {
    settingsWindow = null
  })

  loadRenderer(window, 'settings')
}

function createAppMenu(): void {
  const isMac = process.platform === 'darwin'
  const settingsLabel = isMac ? 'Settings…' : 'Settings...'

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? ([
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                label: settingsLabel,
                accelerator: 'CmdOrCtrl+,',
                click: () => openSettingsWindow()
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ] satisfies MenuItemConstructorOptions[])
      : []),
    ...(!isMac
      ? ([
          {
            label: 'File',
            submenu: [
              {
                label: settingsLabel,
                accelerator: 'Ctrl+,',
                click: () => openSettingsWindow()
              },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ] satisfies MenuItemConstructorOptions[])
      : []),
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://electron-vite.org')
          }
        }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createAppMenu()

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('read-excel-file', (_event, args) => {
    return new Promise((resolve, reject) => {
      creatWorker({ workerData: 'worker' })
        .on('message', (message) => {
          resolve(message)
        })
        .on('error', (err) => {
          reject(err)
        })
        .postMessage(args)
    })
  })

  createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
