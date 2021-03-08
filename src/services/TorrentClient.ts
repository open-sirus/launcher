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

const enum TorrentClientStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

const torrentDownloaderPath: string = TorrentDownloader.path

export class TorrentClient {
  private status = TorrentClientStatus.IDLE
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
        const { torrentId, torrentUrl } = data
        this.startTorrenting(torrentId, torrentUrl)
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
          case 'checking': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_PROGRESS, {
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
          case 'download-setup': {
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_SETUP, {
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

  private async startTorrenting(torrentId: string, torrentUrl: string) {
    if (process.platform === 'darwin') {
      this.eventBus.emit(LauncherEvent.SYSTEM_NOT_SUPPORTED_ERROR)
      return
    }

    const selection = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })

    const directory = selection.filePaths[0]

    if (!selection || selection.canceled || !selection.filePaths[0]) {
      this.eventBus.emit(LauncherEvent.TORRENT_SELECT_FOLDER_ERROR, {
        directory,
      })
      return
    }

    if (this.status === TorrentClientStatus.IN_PROGRESS) {
      console.warn('Torrent already in progress')
      if (this.downloadProcess) {
        try {
          this.downloadProcess.kill()
        } catch (e) {
          console.error('Couldn`t kill process', e)
          // Should we continue?
        }
      }
    }

    this.eventBus.emit(LauncherEvent.TORRENT_SELECT_FOLDER_SUCCESS, {
      directory,
    })

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
      this.status = TorrentClientStatus.ERROR
      console.error(e)
      // Send error event with possible retry
    })

    this.downloadProcess.stderr.on('data', (e) => {
      this.status = TorrentClientStatus.ERROR
      console.error(e.toString())
    })

    this.downloadProcess.on('exit', (code, signal) => {
      if (this.status === TorrentClientStatus.CANCELLED) {
        return
      }

      this.status = TorrentClientStatus.IDLE
      if (code === 0) {
        // Send done event
        this.status = TorrentClientStatus.DONE
      } else {
        console.warn(`Process exit with ${code} ${signal}`)
        // Send error event
      }
    })

    this.status = TorrentClientStatus.IN_PROGRESS

    this.subscribeToStdoutData()

    console.log(torrentId, torrentUrl, directory)
  }

  private stopTorrenting() {
    this.status = TorrentClientStatus.CANCELLED

    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
