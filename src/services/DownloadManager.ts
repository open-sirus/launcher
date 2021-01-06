import { BrowserWindow, session } from 'electron'

export interface IDownloadRequest {
  filename: string
  absolutePath: string
  url: string
  range?: string
  requestId?: number
  inProgress: boolean
}

export class DownloadManager {
  private window: BrowserWindow
  private queue: Map<string, IDownloadRequest> = new Map<
    string,
    IDownloadRequest
  >()

  constructor(window: BrowserWindow) {
    this.window = window

    this.window.webContents.session.on('will-download', (event, item) => {
      const config = this.getConfigByUrl(item.getURLChain()[0])

      if (!config) {
        return
      }

      const path = config.absolutePath

      item.setSavePath(path)

      console.debug('Initiate download of: ', config, item.getURL())

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          config.inProgress = false
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
          }
        }
      })

      item.once('done', (event, state) => {
        if (state === 'completed') {
          config.inProgress = false
        } else {
          // @ts-ignore
          console.warn(`Download failed: ${state}`, event.error)
        }
      })
    })

    session.defaultSession.webRequest.onHeadersReceived((details, next) => {
      let statusLine = details.statusLine
      // If we have range header in request, web server should return 206 status code,
      // but chrome will throw error on such response code, so we just modify it for chrome
      if (details.statusCode === 206 && this.getConfigById(details.id)) {
        statusLine = statusLine.replace('206 Partial Content', '200 OK')
      }

      next({
        cancel: false,
        responseHeaders: details.responseHeaders,
        statusLine: statusLine,
      })
    })

    // Only way to modify range header to support resumable or partial downloads using standard downloader
    session.defaultSession.webRequest.onBeforeSendHeaders(
      {
        urls: ['<all_urls>'],
      },
      (details, next) => {
        const reqHeaders = Object.assign({}, details.requestHeaders)
        // Redirects will have same id, so just keep chain
        const config =
          this.getConfigById(details.id) || this.getConfigByUrl(details.url)
        if (config) {
          if (!config.requestId) {
            // set id
            config.requestId = details.id
          }
          if (config.range) {
            reqHeaders.Range = config.range
          }
        }
        next({
          cancel: false,
          requestHeaders: reqHeaders,
        })
      }
    )
  }

  getConfigByUrl(url: string): IDownloadRequest | undefined {
    return this.queue.get(url)
  }

  getConfigById(id: number): IDownloadRequest | undefined {
    return Object.values(this.queue.values()).find((c) => c.requestId === id)
  }

  startDownload(request: IDownloadRequest) {
    request.inProgress = true
    this.queue.set(request.url, request)
    this.window.webContents.downloadURL(request.url)
  }
}

let instance: DownloadManager

export function getDownloadManager(): DownloadManager {
  if (!instance) {
    throw new Error('Download manager is not initialized')
  }

  return instance
}

export function setDownloadManager(downloadManager: DownloadManager) {
  instance = downloadManager
}
