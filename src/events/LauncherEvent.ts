import LauncherFile, { FileStatus } from '@/entities/LauncherFile'
import {
  FileManageStatus,
  FileValidationProgress,
} from '@/services/FileManageService'
import { IFile } from '@/store/modules/app'

export enum LauncherEvent {
  OPEN_SELECT_GAME_DIRECTORY_DIALOG = 'OPEN_SELECT_GAME_DIRECTORY_DIALOG',
  SELECT_GAME_DIRECTORY = 'SELECT_GAME_DIRECTORY',
  WRONG_GAME_DIRECTORY_SELECTED = 'WRONG_GAME_DIRECTORY_SELECTED',
  FILE_LIST_UPDATED = 'FILE_LIST_UPDATED',
  FILE_STATUS_UPDATED = 'FILE_STATUS_UPDATED',
  FILE_MANAGER_STATUS_CHANGED = 'FILE_MANAGER_STATUS_CHANGED',
  CAN_LAUNCH_GAME = 'CAN_LAUNCH_GAME',
  LAUNCH_GAME = 'LAUNCH_GAME',
  START_ON_SYSTEM_STARTUP = 'START_ON_SYSTEM_STARTUP',
}

export interface IWrongGameDirectorySelectedData {
  directory: string | null
}

export interface ISelectGameDirectoryData {
  directory: string | null
}

export interface IHasClientReadyData {
  hasClientReady: boolean
}

export interface ILaunchGame {
  launchGame: boolean
}

export interface IStartOnSystemStartupData {
  isStartOnSystemStartup: boolean | null
}

export interface IFileStatusUpdated {
  status: FileStatus
  file: LauncherFile
}

export interface IFileManagerStatusChanged {
  status: FileManageStatus
  progress: FileValidationProgress
}

export interface IFileListUpdated extends Array<IFile> {}

export type EventData = {
  // TODO: implement Data by Event correctly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [e in LauncherEvent]?:
    | IWrongGameDirectorySelectedData
    | ISelectGameDirectoryData
    | IStartOnSystemStartupData
    | IHasClientReadyData
    | ILaunchGame
    | IFileStatusUpdated
    | IFileManagerStatusChanged
    | IFileListUpdated
    | null
}
