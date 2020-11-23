import { eventService } from '@/services/EventService'
import { LauncherEvent, ISelectGameDirectoryData, IStartOnSystemStartupData, } from '@/events/LauncherEvent'
import { LauncherListener } from '@/events/LauncherListener'
import store from '@/store'

export class DirectorySelected extends LauncherListener {
  async handle(event: LauncherEvent, { directory }: ISelectGameDirectoryData) {
    // it can be null if windows closed but directory not selected
    await store.dispatch('settings/setClientDirectory', directory, {
      root: true,
    })

    const clientDirectory = store.getters['settings/clientDirectory']

    if (!clientDirectory) {
      eventService.emit(LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED, {
        directory,
      })
    } else {
      // TODO: implement more truthful check to trigger "launch game" action
      eventService.emit(LauncherEvent.CAN_LAUNCH_GAME)
    }
  }
}

class SetStartOnSystemStartup extends LauncherListener {
  handle(
    event: LauncherEvent,
    { isStartOnSystemStartup }: IStartOnSystemStartupData
  ) {
    eventService.emit(LauncherEvent.START_ON_SYSTEM_STARTUP, {
      isStartOnSystemStartup,
    })
  }
}
export function init() {
  eventService.on(LauncherEvent.SELECT_GAME_DIRECTORY, new DirectorySelected())
  eventService.on(
    LauncherEvent.SET_START_ON_SYSTEM_STARTUP,
    new SetStartOnSystemStartup()
  )
}
