import { TrayEvent } from '@/events/tray/trayEvent'
import LauncherListener from '@/events/LauncherListener'

export class TrayEventsListener extends LauncherListener{
  private readonly _callback: (
    event: TrayEvent,
    data: Record<string, unknown>
  ) => void

  constructor(
    callback: (event: TrayEvent, data: Record<string, unknown>) => void,
    once = false
  ) {
    super()
    this._callback = callback
    this.once = once
  }

  handle(event: TrayEvent, data: Record<string, unknown>) {
    this._callback(event, data)
  }
}
