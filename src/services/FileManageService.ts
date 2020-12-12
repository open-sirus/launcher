import cloneDeep from 'lodash/cloneDeep'

import type { LauncherFile, IValidatableFile } from '@/entities/LauncherFile'
import { FileStatus } from '@/entities/LauncherFile'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { getFileHash, isCorrectFile } from '@/utils/files'

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
}

export default new FileManageService()
