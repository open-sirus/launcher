import {
  ChildProcessWithoutNullStreams,
  spawn as spawnChildProcess,
} from 'child_process'
import { resolve as resolvePath } from 'path'
// @ts-ignore
import TorrentDownloader from '@sirussu/torrent-downloader'

import { replaceLast } from '@/utils/replaceLast'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'

import { EventBus } from './EventBus'

const enum TorrentClientStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

const torrentDownloaderPath: string = TorrentDownloader.path

export class TorrentClient {
  private status = TorrentClientStatus.IDLE
  private downloadProcess: ChildProcessWithoutNullStreams | null = null
  private torrentDownloaderPath = ''
  private eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus

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
        const { torrentId, torrentUrl, directionPath } = data
        this.startTorrenting(torrentId, torrentUrl, directionPath)
      }, true)
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
            // Send start event
            break
          }
          case 'download-done': {
            // Send done event
            this.eventBus.emit(LauncherEvent.TORRENT_DOWNLOAD_DONE)
            break
          }
          case 'progress':
          case 'checking': {
            // Send progress event
            break
          }
          case 'torrent-get-error': {
            // Send error event with possible retry
            break
          }
          case 'download-error': {
            // Send error event
            break
          }
          case 'download-setup': {
            console.log('Unhandled message', message)
            break
          }
          default: {
            // Send error event
            break
          }
        }
      }
    })
  }

  startTorrenting(
    torrentId: string,
    torrentUrl: string,
    directionPath: string
  ) {
    if (this.status === TorrentClientStatus.IN_PROGRESS) {
      console.warn('Torrent already in progress')
      if (this.downloadProcess) {
        try {
          this.downloadProcess.kill()
        } catch (e) {
          console.error('Couldn`t kill process', e)
        }
      }
    }

    this.downloadProcess = spawnChildProcess(this.torrentDownloaderPath, [
      'torrent',
      torrentUrl,
      directionPath,
    ])

    this.downloadProcess.on('error', (e) => {
      console.error(e)
      // Send error event with possible retry
    })

    this.downloadProcess.stderr.on('data', (e) => {
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

    console.log(torrentId, torrentUrl, directionPath)
  }

  stopTorrenting() {
    this.status = TorrentClientStatus.CANCELLED

    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
