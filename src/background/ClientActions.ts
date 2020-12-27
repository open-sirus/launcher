import { app, dialog } from 'electron'

import { LauncherListener } from '@/events/LauncherListener'
import {
  IStartOnSystemStartupData,
  LauncherEvent,
} from '@/events/LauncherEvent'
import { eventService } from '@/background/EventService'
import LauncherFile from '@/entities/LauncherFile'
import fileManageService from '@/services/FileManageService'
import { TorrentClient } from '@/services/TorrentClient'

export class SelectDirectory extends LauncherListener {
  async handle() {
    const selection = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    eventService.emit(LauncherEvent.SELECT_GAME_DIRECTORY, {
      directory: selection.canceled ? null : selection.filePaths[0],
    })
  }
}

export class StartOnSystemStartup extends LauncherListener {
  handle(event: LauncherEvent, data: IStartOnSystemStartupData) {
    app.setLoginItemSettings({
      openAtLogin: data.isStartOnSystemStartup,
      openAsHidden: data.isStartInMinimizedMode,
    })
  }
}

export class ValidateFileList extends LauncherListener {
  async handle(
    event: LauncherEvent,
    { files, clientPath }: { files: Array<LauncherFile>; clientPath: string }
  ) {
    await fileManageService.validate(clientPath, files)
  }
}

export function init() {
  eventService.on(
    LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG,
    new SelectDirectory()
  )
  eventService.on(
    LauncherEvent.SET_START_ON_SYSTEM_STARTUP,
    new StartOnSystemStartup()
  )
  eventService.on(
    LauncherEvent.SET_START_IN_MINIMIZED_MODE,
    new StartOnSystemStartup()
  )
  eventService.on(LauncherEvent.FILE_LIST_UPDATED, new ValidateFileList())

  const torrentClient = new TorrentClient(eventService)
  torrentClient.init()
}
