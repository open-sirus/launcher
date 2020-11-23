import { BrowserWindow, Menu, Tray } from 'electron'

import { LauncherEvent } from '@/events/LauncherEvent'

import { buildMenu } from './contextMenu'
import eventService from '../EventService'
import { menuComponentTypes } from '@/background/tray/types'

export const onMinimize = (
  mainWindow: BrowserWindow,
  menu: Menu,
  tray: Tray
) => {
  buildMenu(
    {
      enabled: true,
      type: 'normal',
      label: 'Развернуть',
      click: () => {
        mainWindow.restore()
      },
      nodeType: menuComponentTypes.SHOW_HIDE_APP
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
      enabled: true,
      type: 'normal',
      label: 'Свернуть',
      click: () => {
        mainWindow.minimize()
      },
      nodeType: menuComponentTypes.SHOW_HIDE_APP
    },
    menu,
    tray
  )
}

export const onCanLaunchGame = (menu: Menu, tray: Tray) => {
  buildMenu(
    {
      enabled: true,
      type: 'normal',
      label: 'В игру',
      click: () => {
        eventService.emit(LauncherEvent.LAUNCH_GAME, { launchGame: true })
      },
      nodeType: menuComponentTypes.LAUNCH_GAME
    },
    menu,
    tray
  )
}
