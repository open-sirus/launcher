import path from 'path'
import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray } from 'electron'
import { triggerMainTrayAction } from '@/background/tray/trayMainActions'

type menuTemplate = Array<MenuItemConstructorOptions>

let menuTemplate: menuTemplate

const getMainWindowFromId = (winId: number): BrowserWindow => {
  return BrowserWindow.fromId(winId)
}

const canRunGame = (): boolean => {
  return true
}

const isAppShown = (winId: number): boolean => {
  const mainWindow = getMainWindowFromId(winId)

  return mainWindow.isVisible()
}

const getIconPath = (): string => {
  const isProductionMode: boolean = process.env.NODE_ENV === 'production'
  let icon: string

  if (isProductionMode) {
    icon = path.dirname(process.execPath)
  } else {
    icon = path.resolve('.')
  }

  icon = path.resolve(icon + '/public/icon.png')

  return icon
}

const buildMenuTemplate = (
  isAppShown: boolean,
  canRunGame: boolean,
  winId: number
): menuTemplate => {
  menuTemplate = [
    {
      enabled: canRunGame,
      type: 'normal',
      label: 'В игру',
      click: () => {
        triggerMainTrayAction()
      },
    },
    { enabled: true, type: 'separator' },
    {
      enabled: true,
      type: 'normal',
      label: isAppShown ? 'Свернуть' : 'Развернуть',
      click: () => {
        const mainWindow = getMainWindowFromId(winId)
        if (isAppShown) {
          mainWindow.minimize()
        } else {
          mainWindow.restore()
        }
      },
    },
    {
      enabled: true,
      type: 'normal',
      label: 'Выйти',
      click: () => {
        app.quit()
      },
    },
  ]

  return menuTemplate
}

export const buildMenu = (winId: number, tray?: Tray): Menu | null => {
  const template = buildMenuTemplate(isAppShown(winId), canRunGame(), winId)

  if (tray) {
    tray.setContextMenu(Menu.buildFromTemplate(template))

    return null
  }

  return Menu.buildFromTemplate(template)
}

export const buildTray = (winId: number): Tray => {
  const tray: Tray = new Tray(getIconPath())

  tray.setContextMenu(buildMenu(winId))
  tray.setToolTip('Sirus launcher')

  return tray
}
