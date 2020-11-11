import { TrayEvent } from '@/events/tray/trayEvent'

export class TrayEventsListener {
  private readonly _callback: (
    event: TrayEvent,
    data: Record<string, unknown>
  ) => void

  constructor(
    callback: (event: TrayEvent, data: Record<string, unknown>) => void,
    once = false
  ) {
    this._callback = callback
    this.once = once
  }

  once = false

  handle(event: TrayEvent, data: Record<string, unknown>) {
    this._callback(event, data)
  }
}
