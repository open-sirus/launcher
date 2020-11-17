import path from 'path'
import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray } from 'electron'

import eventService from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'

type MenuTemplate = Array<MenuItemConstructorOptions>

let menuTemplate: MenuTemplate,
    isClientReady: boolean = false

const getMainWindowFromId = (winId: number): BrowserWindow => {
  return BrowserWindow.fromId(winId)
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
  isClientReady: boolean,
  winId: number
): MenuTemplate => {
  menuTemplate = [
    {
      enabled: isClientReady,
      type: 'normal',
      label: 'В игру',
      click: () => {
        eventService.emit(LauncherEvent.RUN_GAME, { runGame: true })
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

const setMenuChangeEventListeners = (mainWindow: BrowserWindow, winId: number, tray?: Tray): void => {
  mainWindow.on('minimize', () => buildMenu(winId, tray))
  mainWindow.on('restore', () => buildMenu(winId, tray))
  eventService.on(LauncherEvent.CAN_RUN_GAME,
    new CallbackListener<LauncherEvent.CAN_RUN_GAME>(
      (event, data) => {
        if (data && 'hasClientReady' in data) {
          isClientReady = data.hasClientReady
        }
        buildMenu(winId, tray)
      }
    )
  )
}

const buildMenu = (winId: number, tray?: Tray): Menu | null => {
  const template = buildMenuTemplate(isAppShown(winId), isClientReady, winId)

  if (tray) {
    tray.setContextMenu(Menu.buildFromTemplate(template))

    return null
  }

  return Menu.buildFromTemplate(template)
}

export const buildTray = (winId: number): Tray => {
  const tray: Tray = new Tray(getIconPath())

  setMenuChangeEventListeners(getMainWindowFromId(winId), winId, tray)
  tray.setContextMenu(buildMenu(winId))
  tray.setToolTip('Sirus launcher')

  return tray
}
