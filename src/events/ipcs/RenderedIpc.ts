import { ipcRenderer } from 'electron'

import { Ipc, EventBus } from '@/services/EventBus'
import type { EventData, LauncherEvent } from '@/events/LauncherEvent'

export class RenderedIpc<E extends LauncherEvent> extends Ipc {
  constructor() {
    super(ipcRenderer)
  }

  send(event: E, data?: EventData[E]) {
    ipcRenderer.send(EventBus.CHANNEL_NAME, { event, data })
  }
}
