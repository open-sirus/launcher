import nodePath from 'path'

import { IFile } from '@/store/modules/app'

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

export default class LauncherFile
  implements IValidatableFile, IDownloadableFile, IFile {
  host: string
  path: string
  size: number
  hash: string
  filename: string
  filePath: string

  static fromObject({ filename, md5, host, size, path }: IFile) {
    return new LauncherFile(
      <string>filename,
      <string>path,
      <string>host,
      <number>size,
      <string>md5
    )
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
    this.filePath = nodePath.normalize(this.path + this.filename)
  }

  downloadAttributes = {
    isDownloading: false,
    isIncomplete: false,
    isValid: false,
    isValidating: false,
  }

  get isDownloading() {
    return this.downloadAttributes.isDownloading
  }

  set isDownloading(isDownloading: boolean) {
    this.downloadAttributes.isDownloading = isDownloading
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
