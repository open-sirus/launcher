import Files from '@/services/Files'
import LauncherFile, {
  FileStatus,
  IValidatableFile,
} from '@/entities/LauncherFile'
import eventService from '@/background/EventService'
import LauncherEvent from '@/events/LauncherEvent'

export class FileValidationProgress {
  private done: number
  private valid: number
  private files: number

  constructor(files: number, done: number, valid: number) {
    this.done = done
    this.valid = valid
    this.files = files
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
    if (!(await Files.isCorrectFile(file.filePath, file.size, null))) {
      return false
    }

    return (
      (await Files.getFileHash(file.filePath)) === file.hash.toLocaleLowerCase()
    )
  }

  async validate(clientPath: string, files: Array<LauncherFile>) {
    this.clientPath = clientPath
    files.forEach((file) => {
      file.isValidating = true
    })

    this.files = files

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
