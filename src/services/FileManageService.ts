import cloneDeep from 'lodash/cloneDeep'
import path from 'path'
import { createWriteStream, existsSync, promises as fs } from 'fs'

import type { IValidatableFile } from '@/entities/LauncherFile'
import { FileStatus, LauncherFile } from '@/entities/LauncherFile'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { getFileHash, getFilesWithPrefix, isCorrectFile } from '@/utils/files'
import type { IDownloadRequest } from '@/services/DownloadManager'
import {
  DownloadRequestStatus,
  getDownloadManager,
} from '@/services/DownloadManager'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MultiStream = require('multistream')

export class FileValidationProgress {
  get filesCount(): number {
    return this._filesCount
  }

  get validatedCount(): number {
    return this._validatedCount
  }

  get validCount(): number {
    return this._validCount
  }

  private _validatedCount: number
  private _validCount: number
  private _filesCount: number

  constructor(filesCount: number, validatedCount: number, validCount: number) {
    this._validCount = validCount
    this._validatedCount = validatedCount
    this._filesCount = filesCount
  }
}

export class FileDownloadProgress {
  doneBytes: number
  totalBytes: number

  constructor(doneBytes: number, totalBytes: number) {
    this.doneBytes = doneBytes
    this.totalBytes = totalBytes
  }
}

class DownloadRequest implements IDownloadRequest {
  absolutePath: string
  filename: string
  inProgress: boolean
  range?: string
  requestId?: number
  url: string
  private file: LauncherFile

  constructor(
    absolutePath: string,
    filename: string,
    url: string,
    file: LauncherFile
  ) {
    this.absolutePath = absolutePath
    this.filename = filename
    this.url = url
    this.file = file
    this.inProgress = false
  }
}

export enum FileManageStatus {
  VALID = 'VALID',
  VALIDATING = 'VALIDATING',
  INVALID = 'INVALID',
  DOWNLOADING = 'DOWNLOADING',
}

export class FileManageService {
  status: FileManageStatus = FileManageStatus.VALID
  files: Array<LauncherFile> = []

  private _clientPath: string | null = null

  set clientPath(value: string | null) {
    this._clientPath = value
  }

  get clientPath(): string | null {
    return this._clientPath
  }

  async isValidFile(file: IValidatableFile, forceHashCheck: boolean) {
    if (!(await isCorrectFile(file.filePath, file.size))) {
      return false
    } else if (!forceHashCheck) {
      return true
    }

    return (await getFileHash(file.filePath)) === file.hash.toLocaleLowerCase()
  }

  async validate(
    clientPath: string,
    files: Array<LauncherFile>,
    forceHashCheck = false
  ) {
    this.clientPath = clientPath
    this.files = cloneDeep(files).map(LauncherFile.restore)

    try {
      await this.moveDownloadedFiles()
    } catch (e) {
      // Files from previous download wasn't moved correctly for some reason
      console.error(e)
    }

    this.files.forEach((file) => {
      file.isValidating = true
    })

    this.updateStatus(FileManageStatus.VALIDATING)
    await Promise.all(
      this.files.map(async (file) => {
        eventService.emit(LauncherEvent.FILE_STATUS_UPDATED, {
          file,
          status: FileStatus.VALIDATING,
        })

        file.isValid = await this.isValidFile(file, forceHashCheck)
        file.isValidating = false

        eventService.emit(LauncherEvent.FILE_STATUS_UPDATED, {
          file,
          status: file.isValid ? FileStatus.VALID : FileStatus.INVALID,
        })

        this.updateStatus()
      })
    )
    this.updateStatus(
      this.files.find((file) => !file.isValid)
        ? FileManageStatus.VALID
        : FileManageStatus.INVALID
    )
    await this.startDownloadIfNeeded()
    try {
      await this.moveDownloadedFiles()
    } catch (e) {
      // Files not moved to game directory possible coz client was launched
      // TODO:: send notification to user
      console.error(e)
    }
  }

  private async startDownloadIfNeeded() {
    let filesToDownload = 0
    for (const file of this.files) {
      if (!file.isValid) {
        if (
          existsSync(
            path.resolve(this.getTempPath(), 'DONE_' + file.downloadFilename)
          )
        ) {
          console.warn('File already downloaded but not moved.')
          continue
        }
        filesToDownload++
        file.downloadProgress = null
        const request = await this.generateRequestFor(file)
        request.callback = (progress) => {
          file.downloadProgress = progress
          if (progress.status === DownloadRequestStatus.DONE) {
            this.concatFile(file, request)
          }
        }
        console.log('START -> ', request)
        getDownloadManager().startDownload(request)
      }
    }
    if (filesToDownload) {
      const progressUpdateInterval = setInterval(() => {
        const downloading = this.files.filter((file) => !file.isValid)
        const completed = downloading.filter(
          (file) => file.downloadProgress != null && !file.isDownloading
        )
        this.updateDownloadStatus(downloading)

        if (completed.length === downloading.length) {
          clearInterval(progressUpdateInterval)
        }
      }, 500)
    }
  }

  private updateStatus(status?: FileManageStatus) {
    this.status = status || FileManageStatus.VALIDATING
    eventService.emit(LauncherEvent.FILE_MANAGER_STATUS_CHANGED, {
      status: this.status,
      progress: new FileValidationProgress(
        this.files.length,
        this.files.filter((file) => !file.isValidating).length,
        this.files.filter((file) => !file.isValidating && file.isValid).length
      ),
    })
  }

  private getTempPath(): string {
    if (!this.clientPath) {
      throw new Error('Client path is not provided')
    }

    return path.join(this.clientPath, 'launcher_temp')
  }

  private async generateRequestFor(
    file: LauncherFile
  ): Promise<IDownloadRequest> {
    const tempDownloadDir = this.getTempPath()
    if (!existsSync(tempDownloadDir)) {
      await fs.mkdir(tempDownloadDir)
    }
    const filePath = path.join(
      tempDownloadDir,
      file.downloadFilename + '.part'
    )

    const request = new DownloadRequest(
      filePath,
      file.filename,
      file.host + file.filename,
      file
    )
    console.log(file.downloadFilename, file)
    const parts = await getFilesWithPrefix(
      tempDownloadDir,
      file.downloadFilename
    )
    // Previous download isn`t completed for some reason
    if (parts.length) {
      const stats = await Promise.all(
        parts.map(
          async (name) => await fs.stat(path.resolve(tempDownloadDir, name))
        )
      )
      const allPartsSize: number = stats.reduce((size, stat) => {
        return size + stat.size
      }, 0)

      // Size of previous parts is more than expected file size, so we will start from scratch
      if (allPartsSize > file.size) {
        for (const filePart of parts) {
          await fs.unlink(path.join(tempDownloadDir, filePart))
        }
      } else {
        request.range = `${allPartsSize}-`
      }
    }

    return request
  }

  private updateDownloadStatus(downloading: LauncherFile[]) {
    const completed = downloading.filter(
      (file) => file.downloadProgress != null && !file.isDownloading
    )
    this.status =
      completed.length === downloading.length
        ? FileManageStatus.VALIDATING
        : FileManageStatus.DOWNLOADING

    const total = downloading.reduce(
      (size, file) => size + (file.downloadProgress?.totalBytes || 0),
      0
    )

    const downloaded = completed.reduce(
      (size, file) => size + (file.downloadProgress?.doneBytes || 0),
      0
    )

    eventService.emit(LauncherEvent.FILE_MANAGER_STATUS_CHANGED, {
      status: this.status,
      progress: new FileDownloadProgress(downloaded, total),
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async concatFile(file: LauncherFile, request: IDownloadRequest) {
    const parts = (
      await getFilesWithPrefix(this.getTempPath(), file.downloadFilename)
    ).sort()

    const outFilePath = path.join(this.getTempPath(), parts[0])
    const newPath = path.join(
      this.getTempPath(),
      'DONE_' + file.downloadFilename
    )
    // First file will be "output" file
    const out = createWriteStream(
      path.join(this.getTempPath(), outFilePath),
      { flags: 'a' }
    )
    parts.splice(0, 1)

    const input = new MultiStream(
      parts.map((f) => path.join(this.getTempPath(), f))
    )
    input.pipe(out)

    return new Promise((resolve, reject) => {
      // Set 10 mins timeout for concat operation
      const timeout = setTimeout(() => {
        out.emit('end')
      }, 1000 * 60 * 10)
      input.on('end', function () {
        fs.rename(outFilePath, newPath).then(resolve).catch(reject)
        parts.forEach(fs.unlink)
        clearTimeout(timeout)
      })

      input.on('error', (e: Error) => {
        reject(e)
        clearTimeout(timeout)
      })
      out.on('error', (e) => {
        reject(e)
        clearTimeout(timeout)
      })
    })
  }

  private async moveDownloadedFiles() {
    const completed = await getFilesWithPrefix(this.getTempPath(), 'DONE_')
    await Promise.all(
      completed.map(async (file) => {
        const filename = file.replace('DONE_', '')
        const pathToFile = path.join(this.getTempPath(), file)
        const downloadableFile = this.files.find(
          (f) => f.downloadFilename === filename
        )

        // File exists but has wrong hash
        if (!downloadableFile) {
          console.warn('Wrong file hash, remove', filename)
          await fs.unlink(pathToFile)
          return
        }

        if (!this.clientPath) {
          return false
        }

        await fs.rename(
          pathToFile,
          path.join(this.clientPath, downloadableFile.filePath)
        )

        console.debug(
          'Move file',
          pathToFile,
          path.join(this.clientPath, downloadableFile.filePath)
        )

        eventService.emit(LauncherEvent.FILE_STATUS_UPDATED, {
          file: downloadableFile,
          status: FileStatus.VALID,
        })
      })
    )
  }
}

export default new FileManageService()
