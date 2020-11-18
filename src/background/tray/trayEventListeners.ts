import { BrowserWindow, Menu, Tray } from 'electron'

import eventService from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import {
  onCanRunGame,
  onMinimize,
  onRestore,
} from '@/background/tray/trayEventHandlers'

export const registerTrayEventListeners = (
  mainWindow: BrowserWindow,
  menu: Menu,
  tray: Tray
) => {
  mainWindow.on('minimize', () => onMinimize(mainWindow, menu, tray))

  mainWindow.on('restore', () => onRestore(mainWindow, menu, tray))

  eventService.on(
    LauncherEvent.CAN_RUN_GAME,
    new CallbackListener<LauncherEvent.CAN_RUN_GAME>(() =>
      onCanRunGame(menu, tray)
    )
  )
}
