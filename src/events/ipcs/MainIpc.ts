import { ipcMain, BrowserWindow } from 'electron'

import EventBus, { Ipc } from '@/services/EventBus'
import { EventData, LauncherEvent } from '@/events/LauncherEvent'

export default class MainIpc<E extends LauncherEvent> extends Ipc {
  constructor() {
    super(ipcMain)
  }

  send(event: E, data?: EventData[E]) {
    BrowserWindow.getAllWindows().forEach((w) =>
      w.webContents.send(EventBus.CHANNEL_NAME, { event, data })
    )
  }
}
