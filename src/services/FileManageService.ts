import cloneDeep from 'lodash/cloneDeep'

import LauncherFile, {
  FileStatus,
  IValidatableFile,
} from '@/entities/LauncherFile'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { getFileHash, isCorrectFile } from '@/utils/files'

export class FileValidationProgress {
  private validatedCount: number
  private validCount: number
  private filesCount: number

  constructor(filesCount: number, validatedCount: number, validCount: number) {
    this.validCount = validCount
    this.validatedCount = validatedCount
    this.filesCount = filesCount
  }
}

export enum FileManageStatus {
  VALID,
  VALIDATING,
  INVALID,
  DOWNLOADING,
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

  async isValidFile(file: IValidatableFile) {
    if (!(await isCorrectFile(file.filePath, file.size))) {
      return false
    }

    return (await getFileHash(file.filePath)) === file.hash.toLocaleLowerCase()
  }

  async validate(clientPath: string, files: Array<LauncherFile>) {
    this.clientPath = clientPath
    this.files = cloneDeep(files)

    files.forEach((file) => {
      file.isValidating = true
    })

    this.updateStatus(FileManageStatus.VALIDATING)

    await Promise.all(
      files.map(async (file) => {
        eventService.emit(LauncherEvent.FILE_STATUS_UPDATED, {
          file,
          status: FileStatus.VALIDATING,
        })

        file.isValid = await this.isValidFile(file)
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
    if (status) {
      this.status = status
    }
    eventService.emit(LauncherEvent.FILE_MANAGER_STATUS_CHANGED, {
      status: FileManageStatus.VALIDATING,
      progress: new FileValidationProgress(
        this.files.length,
        this.files.filter((file) => !file.isValidating).length,
        this.files.filter((file) => !file.isValidating && file.isValid).length
      ),
    })
  }
}

export default new FileManageService()
