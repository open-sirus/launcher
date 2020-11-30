import { BrowserWindow, Menu, Tray } from 'electron'

import eventService from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import { eventListeners } from '@/background/tray/trayEventHandlers'

export const registerTrayEventListeners = (
  mainWindow: BrowserWindow,
  menu: Menu,
  tray: Tray
) => {
  mainWindow.on('minimize', () =>
    eventListeners.onMinimize(mainWindow, menu, tray)
  )

  mainWindow.on('restore', () =>
    eventListeners.onRestore(mainWindow, menu, tray)
  )

  eventService.on(
    LauncherEvent.CAN_LAUNCH_GAME,
    new CallbackListener<LauncherEvent.CAN_LAUNCH_GAME>(() =>
      eventListeners.onCanLaunchGame(menu, tray)
    )
  )
}
