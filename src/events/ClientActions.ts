import { eventService } from '@/services/EventService'
import type {
  ISelectGameDirectoryData,
  IFileManagerStatusChanged,
} from '@/events/LauncherEvent'
import { LauncherEvent } from '@/events/LauncherEvent'
import { LauncherListener } from '@/events/LauncherListener'
import type { Store } from '@/views/store'

// TODO: try to move it to client (view) folder
export class DirectorySelected extends LauncherListener {
  store: Store

  constructor(store: Store) {
    super()

    this.store = store
  }

  async handle(event: LauncherEvent, { directory }: ISelectGameDirectoryData) {
    if (!directory) {
      return
    }

    await this.store.dispatch('settings/setClientDirectory', directory, {
      root: true,
    })

    const clientDirectory = this.store.getters['settings/clientDirectory']

    if (!clientDirectory) {
      eventService.emit(LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED, {
        directory,
      })
    } else {
      eventService.emit(LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED, {
        directory: clientDirectory,
      })

      // TODO: implement more truthful check to trigger "launch game" action
      eventService.emit(LauncherEvent.CAN_LAUNCH_GAME)
    }
  }
}

export class FileManagerStatusChanged extends LauncherListener {
  constructor(private store: Store) {
    super()

    this.store = store
  }

  async handle(
    event: LauncherEvent,
    { status, progress }: IFileManagerStatusChanged
  ) {
    await this.store.dispatch('app/setValidationStatus', { status, progress })
  }
}

export function init(store: Store) {
  eventService.on(
    LauncherEvent.FILE_MANAGER_STATUS_CHANGED,
    new FileManagerStatusChanged(store)
  )
  eventService.on(
    LauncherEvent.SELECT_GAME_DIRECTORY,
    new DirectorySelected(store)
  )
}
