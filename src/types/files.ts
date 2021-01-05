export interface IFile {
  id?: number | string
  isDownloading?: boolean
  isIncomplete?: boolean
  path?: string
  md5?: string
  size?: number
  filename?: string
  host?: string
  storagePath?: string
  updatedAt?: string
  createdAt?: string
  new?: boolean // TODO: use isNew everywhere
  isNew?: boolean // TODO: use isNew everywhere
  status?: number // TODO: make enum
}
