import { ipcMain, BrowserWindow } from 'electron'

import EventBus, { Ipc } from '@/services/EventBus'
import { LauncherEvent } from '@/events/LauncherEvent'
import { TrayEvent } from '@/events/tray/trayEvent'

export default class MainIpc extends Ipc {
  constructor() {
    super(ipcMain)
  }

  send(event, data: Record<string, unknown>) {
    BrowserWindow.getAllWindows().forEach((w) =>
      w.webContents.send(EventBus.CHANNEL_NAME, { event, data })
    )
  }
}
