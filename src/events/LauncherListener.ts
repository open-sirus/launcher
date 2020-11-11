import { LauncherEvent } from '@/events/LauncherEvent'
import { TrayEvent } from '@/events/tray/trayEvent'

export abstract class LauncherListener {
  once = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract handle(event: LauncherEvent | TrayEvent, data?: any)
}
