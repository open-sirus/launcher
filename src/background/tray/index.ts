import { Tray } from 'electron'

import { initialContextMenu } from '@/background/tray/contextMenu'
import { registerTrayEventListeners } from '@/background/tray/trayEventListeners'

import { getIconPath, getMainWindowById } from './helpers'

export const initTray = (winId: number): Tray => {
  const tray = new Tray(getIconPath())
  const mainWindow = getMainWindowById(winId)
  const initialMenu = initialContextMenu(mainWindow)

  tray.setToolTip('Sirus launcher')
  tray.setContextMenu(initialMenu)

  registerTrayEventListeners(mainWindow, initialMenu, tray)

  return tray
}
