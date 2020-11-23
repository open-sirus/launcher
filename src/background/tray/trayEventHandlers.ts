import { BrowserWindow, Menu, Tray } from 'electron'

import { LauncherEvent } from '@/events/LauncherEvent'

import { buildMenu } from './contextMenu'
import eventService from '../EventService'

export const onMinimize = (
  mainWindow: BrowserWindow,
  menu: Menu,
  tray: Tray
) => {
  buildMenu(
    {
      id: '3',
      isEnabled: true,
      type: 'normal',
      label: 'Развернуть',
      click: () => {
        mainWindow.restore()
      },
    },
    menu,
    tray
  )
}

export const onRestore = (
  mainWindow: BrowserWindow,
  menu: Menu,
  tray: Tray
) => {
  buildMenu(
    {
      id: '3',
      isEnabled: true,
      type: 'normal',
      label: 'Свернуть',
      click: () => {
        mainWindow.minimize()
      },
    },
    menu,
    tray
  )
}

export const onCanLaunchGame = (menu: Menu, tray: Tray) => {
  buildMenu(
    {
      id: '1',
      isEnabled: true,
      type: 'normal',
      label: 'В игру',
      click: () => {
        eventService.emit(LauncherEvent.LAUNCH_GAME, { launchGame: true })
      },
    },
    menu,
    tray
  )
}
