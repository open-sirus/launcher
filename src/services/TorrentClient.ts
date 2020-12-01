import { ChildProcessWithoutNullStreams } from 'child_process'

export class TorrentClient {
  private isInProgress = false
  private isDoneSend = false
  private isCancelled = true
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
    this.isCancelled = false
    console.log(torrentId, torrentUrl, path, torrentDirectory)
  }

  stopTorrenting() {
    this.isCancelled = true

    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
