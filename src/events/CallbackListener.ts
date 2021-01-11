import type { LauncherEvent, EventData } from '@/events/LauncherEvent'
import { LauncherListener } from '@/events/LauncherListener'

export class CallbackListener<
  E extends LauncherEvent
> extends LauncherListener {
  handled = false
  private readonly _callback: (event: E, data: EventData[E]) => void

  constructor(callback: (event: E, data: EventData[E]) => void, once = false) {
    super()
    this._callback = callback
    this.once = once
  }

  handle(event: E, data: EventData[E]) {
    if (this.once && this.handled) {
      return
    }

    this._callback(event, data)
    this.handled = true
  }
}
