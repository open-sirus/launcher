import { ChildProcessWithoutNullStreams } from 'child_process'

const enum TorrentClientStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

export class TorrentClient {
  private status = TorrentClientStatus.IDLE
  private downloadProcess: ChildProcessWithoutNullStreams | null = null
  private executableFile = null
  private eventBus = null

  constructor(eventBus) {
    this.eventBus = eventBus
  }

  private subscribeToExternalEvents() {
    console.log('subscribeToExternalEvents')
  }

  private subscribeToStdinData() {
    console.log('subscribeToStdinData')
  }

  startTorrenting(torrentId, torrentUrl, path, torrentDirectory) {
    console.log(torrentId, torrentUrl, path, torrentDirectory)
  }

  stopTorrenting() {
    this.status = TorrentClientStatus.CANCELLED

    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
