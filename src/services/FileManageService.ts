import cloneDeep from 'lodash/cloneDeep'
import path from 'path'
import { existsSync, promises as fs } from 'fs'

import type { LauncherFile, IValidatableFile } from '@/entities/LauncherFile'
import { FileStatus } from '@/entities/LauncherFile'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { getFileHash, getFilesWithPrefix, isCorrectFile } from '@/utils/files'
import {
  getDownloadManager,
  IDownloadRequest,
} from '@/services/DownloadManager'

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
    this.files = cloneDeep(files)

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
  }

  private async startDownloadIfNeeded() {
    let filesToDownload = 0
    for (const file of this.files) {
      if (!file.isValid) {
        filesToDownload++
        file.downloadProgress = null
        const request = await this.generateRequestFor(file)
        request.callback = (progress) => {
          file.downloadProgress = progress
        }
        console.log(request)
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

  private async generateRequestFor(
    file: LauncherFile
  ): Promise<IDownloadRequest> {
    if (!this.clientPath) {
      throw new Error('Client path is not provided')
    }
    const tempDownloadDir = path.resolve(this.clientPath, 'launcher_temp')
    if (!existsSync(tempDownloadDir)) {
      await fs.mkdir(tempDownloadDir)
    }
    const fileName = file.filename + '_' + file.hash
    const filePath = path.resolve(tempDownloadDir, fileName + '.part')

    const request = new DownloadRequest(
      filePath,
      file.filename,
      file.host + file.filename,
      file
    )

    const parts = await getFilesWithPrefix(tempDownloadDir, fileName)
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
          await fs.unlink(path.resolve(tempDownloadDir, filePart))
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
}

export default new FileManageService()
