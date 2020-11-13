import eventService from '../EventService'
import { TrayEvent } from '@/events/tray/trayEvent'
import LauncherListener from '@/events/LauncherListener'

class TrayActions extends LauncherListener {
  handle(event: TrayEvent, data: Record<string, any>) {
    // TODO: need to implement listener
  }
}

export const triggerMainTrayAction = (): void => {
  eventService.on(TrayEvent.RUN_GAME, new TrayActions())
}
