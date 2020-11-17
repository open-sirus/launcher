import { LauncherEvent } from '@/events/LauncherEvent'

export abstract class LauncherListener {
  once = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract handle(event: LauncherEvent, data?: any)
}
