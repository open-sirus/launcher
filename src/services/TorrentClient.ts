// @ts-ignore
import TorrentDownloader from '@sirussu/torrent-downloader'
import { spawn as spawnChildProcess } from 'child_process'
import type { ChildProcessWithoutNullStreams } from 'child_process'
import { resolve as resolvePath } from 'path'
import { dialog, app } from 'electron'

import { replaceLast } from '@/utils/replaceLast'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import { downloadFile } from '@/utils/downloadFile'

import type { EventBus } from './EventBus'

const torrentDownloaderPath: string = TorrentDownloader.path

export class TorrentClient {
  private downloadProcess: ChildProcessWithoutNullStreams | null = null
  private torrentDownloaderPath = ''
  private eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  init() {
    const executablePath = replaceLast(
      'app.asar',
      'app.asar.unpacked',
      torrentDownloaderPath
    )

    if (process.platform === 'win32') {
      const type = `td-win-${process.arch === 'ia32' ? 'x86' : 'x64'}`
      this.torrentDownloaderPath = resolvePath(
        executablePath,
        'vendor',
        type,
        `${type}.exe`
      )
    } else {
      // we don`t support any other arch.
      this.torrentDownloaderPath = resolvePath(
        executablePath,
        'vendor',
        'td-linux-x64',
        'td-linux-x64'
      )
    }

    this.subscribeToExternalEvents()
  }

  private subscribeToExternalEvents() {
    this.eventBus.on(
      LauncherEvent.START_TORRENT,
      new CallbackListener<LauncherEvent.START_TORRENT>((_, data) => {
        const { torrentId, torrentUrl, directory } = data
        this.startTorrenting(torrentId, torrentUrl, directory)
      })
    )

    this.eventBus.on(
      LauncherEvent.PAUSE_TORRENT,
      new CallbackListener<LauncherEvent.PAUSE_TORRENT>(() => {
        // TODO: Implement pause torrenting
      })
    )

    this.eventBus.on(
      LauncherEvent.STOP_TORRENT,
      new CallbackListener<LauncherEvent.STOP_TORRENT>(() => {
        this.stopTorrenting()
      })
    )
  }

  private subscribeToStdoutData() {
    this.downloadProcess?.stdout.on('data', (data) => {
      data = data.toString()

      // Well may be that bad way to check
      // TODO: send only JSON from torrent process
      if (data.startsWith('{')) {
        const message = JSON.parse(data)
        if (!message) {
          return false
        }

        switch (message.type) {
          case 'download-setup': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_SETUP, {
              message,
            })
            break
          }
          case 'download-started': {
            // Name of directory in message
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_STARTED, {
              message: message.message,
            })
            break
          }
          case 'download-done': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_DONE)
            break
          }
          case 'progress':
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_PROGRESS, {
              message,
            })
            break
          case 'checking': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_CHECKING, {
              message,
            })
            break
          }
          case 'torrent-get-error': {
            this.eventBus.emit(LauncherEvent.TORRENT_GET_ERROR, {
              message,
            })
            break
          }
          case 'download-error': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_ERROR, {
              message,
            })
            break
          }
          default: {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_ERROR, {
              message,
            })
            break
          }
        }
      }
    })
  }

  private async startTorrenting(
    torrentId: string,
    torrentUrl: string,
    folderPath?: string
  ) {
    if (process.platform === 'darwin') {
      this.eventBus.emit(LauncherEvent.SYSTEM_NOT_SUPPORTED_ERROR)
      return
    }

    // Get path without client folder
    let directory = resolvePath(folderPath || '', '..')

    if (!directory) {
      const selection = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      })

      directory = selection.filePaths[0]

      if (!selection || selection.canceled || !selection.filePaths[0]) {
        this.eventBus.emit(LauncherEvent.TORRENT_SELECT_FOLDER_ERROR, {
          directory,
        })
        return
      }

      const CLIENT_FOLDER_NAME = 'World of Warcraft Sirus' // TODO: get from torrent event
      this.eventBus.emit(LauncherEvent.TORRENT_SELECT_FOLDER_SUCCESS, {
        directory: resolvePath(directory, CLIENT_FOLDER_NAME),
      })
    }

    // Relaunch torrent
    if (this.downloadProcess) {
      try {
        this.downloadProcess.kill()
      } catch (e) {
        console.error('Couldn`t kill process', e)
        // Should we continue?
      }
    }

    const torrentFilePath = resolvePath(
      app.getPath('userData'),
      'sirus.torrent'
    )
    await downloadFile(torrentUrl, torrentFilePath)

    this.downloadProcess = spawnChildProcess(this.torrentDownloaderPath, [
      'torrent',
      torrentFilePath,
      directory,
    ])

    this.downloadProcess.on('error', (e) => {
      console.error(e)
      // Send error event with possible retry
    })

    this.downloadProcess.stderr.on('data', (e) => {
      console.error(e.toString())
    })

    this.downloadProcess.on('exit', (code, signal) => {
      if (code === 0) {
        this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_DONE)
      } else {
        console.warn(`Process exit with ${code} ${signal}`)
      }
    })

    this.subscribeToStdoutData()

    console.log(torrentId, torrentUrl, directory)
  }

  private stopTorrenting() {
    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
