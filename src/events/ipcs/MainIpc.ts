import { ipcMain, BrowserWindow } from 'electron'

import { EventBus, Ipc } from '@/services/EventBus'
import type { EventData, LauncherEvent } from '@/events/LauncherEvent'

export class MainIpc<E extends LauncherEvent> extends Ipc {
  constructor() {
    super(ipcMain)
  }

  send(event: E, data?: EventData[E]) {
    BrowserWindow.getAllWindows().forEach((w) =>
      w.webContents.send(EventBus.CHANNEL_NAME, { event, data })
    )
  }
}
