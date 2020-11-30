import { ipcRenderer } from 'electron'

import EventBus, { Ipc } from '@/services/EventBus'
import { EventData, LauncherEvent } from '@/events/LauncherEvent'

export default class RenderedIpc<E extends LauncherEvent> extends Ipc {
  constructor() {
    super(ipcRenderer)
  }

  send(event: E, data?: EventData[E]) {
    ipcRenderer.send(EventBus.CHANNEL_NAME, { event, data })
  }
}
