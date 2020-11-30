import { LauncherEvent, EventData } from '@/events/LauncherEvent'
import { LauncherListener } from '@/events/LauncherListener'

export class CallbackListener<
  E extends LauncherEvent
> extends LauncherListener {
  private readonly _callback: (event: E, data: EventData[E]) => void

  constructor(callback: (event: E, data: EventData[E]) => void, once = false) {
    super()
    this._callback = callback
    this.once = once
  }

  handle(event: E, data: EventData[E]) {
    this._callback(event, data)
  }
}
