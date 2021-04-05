import nodePath from 'path'

import type { IFile } from '@/types/files'
import type { DownloadRequestProgress } from '@/services/DownloadManager'
import { DownloadRequestStatus } from '@/services/DownloadManager'

export interface IValidatableFile {
  filePath: string
  size: number
  hash: string
}

export interface IDownloadableFile {
  host: string
  path: string
  filename: string
}

export enum FileStatus {
  VALIDATING,
  VALID,
  INVALID,

  DOWNLOADING,
  DOWNLOADED,
  DOWNLOAD_FAILED,
}

export class LauncherFile
  implements IValidatableFile, IDownloadableFile, IFile {
  host: string
  path: string
  size: number
  hash: string
  filename: string
  filePath: string
  downloadProgress: DownloadRequestProgress | null

  static fromObject({ filename, md5, host, size, path }: IFile) {
    return new LauncherFile(
      <string>filename,
      <string>path,
      <string>host,
      <number>size,
      <string>md5
    )
  }

  /**
   * Restore object after deep clone
   * @param data
   */
  static restore(data: LauncherFile) {
    const file = LauncherFile.fromObject({ ...data, md5: data.hash })

    file.downloadProgress = data.downloadProgress

    return file
  }

  constructor(
    filename: string,
    path: string,
    host: string,
    size: number,
    hash: string
  ) {
    this.host = host
    this.path = path
    this.size = size
    this.hash = hash
    this.filename = filename
    this.filePath = nodePath.join(this.path, this.filename)
    this.downloadProgress = null
  }

  downloadAttributes = {
    isIncomplete: false,
    isValid: false,
    isValidating: false,
  }

  get downloadFilename(): string {
    return this.filename + '_' + this.hash
  }

  get isDownloading() {
    return (
      this.downloadProgress != null &&
      this.downloadProgress.status === DownloadRequestStatus.PROGRESS
    )
  }

  get isIncomplete() {
    return this.downloadAttributes.isIncomplete
  }

  set isIncomplete(isIncomplete: boolean) {
    this.downloadAttributes.isIncomplete = isIncomplete
  }

  set isValid(isValid: boolean) {
    this.downloadAttributes.isValid = isValid
  }

  get isValid() {
    return this.downloadAttributes.isValid
  }

  set isValidating(isValidating: boolean) {
    this.downloadAttributes.isValid = isValidating
  }

  get isValidating() {
    return this.downloadAttributes.isValid
  }
}
