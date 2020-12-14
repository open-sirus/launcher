import { BrowserWindow, Tray } from 'electron'

import { initContextMenu } from '@/background/tray/contextMenu'
import { registerTrayEventListeners } from '@/background/tray/trayEventListeners'
import { PROJECT_TITLE } from '@/constants'

import { createImageFromPath } from './helpers'

export const initTray = (mainWindow: BrowserWindow): Tray => {
  const tray = new Tray(createImageFromPath())
  const initialMenu = initContextMenu(mainWindow)

  tray.setToolTip(PROJECT_TITLE)
  tray.setContextMenu(initialMenu)

  registerTrayEventListeners(mainWindow, initialMenu, tray)

  return tray
}
