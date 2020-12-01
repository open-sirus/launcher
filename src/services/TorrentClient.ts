import { ChildProcessWithoutNullStreams } from 'child_process'

export class TorrentClient {
  private isInProgress = false
  private isDoneSend = false
  private isCancelled = true
  private downloadProcess: ChildProcessWithoutNullStreams | null = null
  private executableFile = null

  constructor(eventBus) {}

  private subscribeToExternalEvents() {}
  private subscribeToStdinData() {}

  startTorrenting(torrentId, torrentUrl, path, torrentDirectory) {
    this.isCancelled = false
  }

  stopTorrenting() {
    this.isCancelled = true

    if (!this.downloadProcess) {
      return
    }

    this.downloadProcess.kill()
  }
}
