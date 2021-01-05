import { eventService } from '@/services/EventService'
import { LauncherEvent, ISelectGameDirectoryData } from '@/events/LauncherEvent'
import { LauncherListener } from '@/events/LauncherListener'
import store from '@/views/store'

export class DirectorySelected extends LauncherListener {
  // TODO: try to move it to client (view) folder
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

export function init() {
  eventService.on(LauncherEvent.SELECT_GAME_DIRECTORY, new DirectorySelected())
}
