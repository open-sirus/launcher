import { LauncherEvent } from '@/events/LauncherEvent'

export abstract class LauncherListener {
  once = false
  abstract handle(event: LauncherEvent, data?: unknown)
}
