import type { LauncherFile, FileStatus } from '@/entities/LauncherFile'
import type {
  FileDownloadProgress,
  FileManageStatus,
  FileValidationProgress,
} from '@/services/FileManageService'

export enum LauncherEvent {
  OPEN_SELECT_GAME_DIRECTORY_DIALOG = 'OPEN_SELECT_GAME_DIRECTORY_DIALOG',
  SELECT_GAME_DIRECTORY = 'SELECT_GAME_DIRECTORY',
  WRONG_GAME_DIRECTORY_SELECTED = 'WRONG_GAME_DIRECTORY_SELECTED',
  CORRECT_GAME_DIRECTORY_SELECTED = 'CORRECT_GAME_DIRECTORY_SELECTED',
  FILE_LIST_UPDATED = 'FILE_LIST_UPDATED',
  FILE_STATUS_UPDATED = 'FILE_STATUS_UPDATED',
  FILE_MANAGER_STATUS_CHANGED = 'FILE_MANAGER_STATUS_CHANGED',
  CAN_LAUNCH_GAME = 'CAN_LAUNCH_GAME',
  LAUNCH_GAME = 'LAUNCH_GAME',
  SET_START_ON_SYSTEM_STARTUP = 'SET_START_ON_SYSTEM_STARTUP',
  SET_START_IN_MINIMIZED_MODE = 'SET_START_IN_MINIMIZED_MODE',
  SYSTEM_NOT_SUPPORTED_ERROR = 'SYSTEM_NOT_SUPPORTED_ERROR',
  START_TORRENT = 'START_TORRENT',
  PAUSE_TORRENT = 'PAUSE_TORRENT',
  STOP_TORRENT = 'STOP_TORRENT', // stop torrent process and need to download from scratch
  TORRENT_DOWNLOAD_STARTED = 'TORRENT_DOWNLOAD_STARTED',
  TORRENT_SELECT_FOLDER_ERROR = 'TORRENT_SELECT_FOLDER_ERROR',
  TORRENT_SELECT_FOLDER_SUCCESS = 'TORRENT_SELECT_FOLDER_SUCCESS',
  TORRENT_DOWNLOAD_DONE = 'TORRENT_DOWNLOAD_DONE',
  TORRENT_DOWNLOAD_CHECKING = 'TORRENT_DOWNLOAD_CHECKING',
  TORRENT_DOWNLOAD_PROGRESS = 'TORRENT_DOWNLOAD_PROGRESS',
  TORRENT_DOWNLOAD_ERROR = 'TORRENT_DOWNLOAD_ERROR',
  TORRENT_DOWNLOAD_SETUP = 'TORRENT_DOWNLOAD_SETUP',
  TORRENT_GET_ERROR = 'TORRENT_GET_ERROR',
}

export interface IWrongGameDirectorySelectedData {
  directory: string | null
}

export interface ISelectGameDirectoryData {
  directory: string | null
}

export interface ICorrectGameDirectoryData {
  directory: string
}

export interface IHasClientReadyData {
  hasClientReady: boolean
}

export interface ILaunchGame {
  launchGame: boolean
}

export interface IStartOnSystemStartupData {
  isStartOnSystemStartup?: boolean
  isStartInMinimizedMode?: boolean
}

export interface IFileStatusUpdated {
  status: FileStatus
  file: LauncherFile
}

export interface IFileManagerStatusChanged {
  status: FileManageStatus
  progress: FileValidationProgress | FileDownloadProgress
}

export interface IFileListUpdated {
  files: Array<LauncherFile>
  clientPath: string
}

export interface ITorrentSelectFolderData {
  directory: string | null
}
export interface IStartTorrent {
  torrentId: string
  torrentUrl: string
  directory?: string
}

export interface ITorrentData {
  message: string
}

export interface ITorrentProgressData {
  message: {
    bytes: number
    progress: number
    // eslint-disable-next-line camelcase
    bytes_done: number
    speed: number
  }
}

export interface ITorrentCheckingData {
  message: {
    bytes: number
    progress: number
    // eslint-disable-next-line camelcase
    bytes_done: number
    speed: number
  }
}
export interface ITorrentDownloadError extends ITorrentData {
  isDisabled?: boolean
  message: string
}

export type EventData = {
  [LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG]: null
  [LauncherEvent.SELECT_GAME_DIRECTORY]: ISelectGameDirectoryData
  [LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED]: IWrongGameDirectorySelectedData
  [LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED]: ICorrectGameDirectoryData
  [LauncherEvent.FILE_LIST_UPDATED]: IFileListUpdated
  [LauncherEvent.FILE_STATUS_UPDATED]: IFileStatusUpdated
  [LauncherEvent.FILE_MANAGER_STATUS_CHANGED]: IFileManagerStatusChanged
  [LauncherEvent.CAN_LAUNCH_GAME]: null
  [LauncherEvent.LAUNCH_GAME]: ILaunchGame
  [LauncherEvent.SET_START_ON_SYSTEM_STARTUP]: IStartOnSystemStartupData
  [LauncherEvent.SET_START_IN_MINIMIZED_MODE]: IStartOnSystemStartupData
  [LauncherEvent.START_TORRENT]: IStartTorrent
  [LauncherEvent.PAUSE_TORRENT]: null
  [LauncherEvent.STOP_TORRENT]: null
  [LauncherEvent.TORRENT_DOWNLOAD_STARTED]: ITorrentData
  [LauncherEvent.TORRENT_SELECT_FOLDER_ERROR]: ITorrentSelectFolderData
  [LauncherEvent.TORRENT_SELECT_FOLDER_SUCCESS]: ITorrentSelectFolderData
  [LauncherEvent.TORRENT_DOWNLOAD_DONE]: null
  [LauncherEvent.TORRENT_DOWNLOAD_CHECKING]: ITorrentCheckingData
  [LauncherEvent.TORRENT_DOWNLOAD_PROGRESS]: ITorrentProgressData
  [LauncherEvent.TORRENT_DOWNLOAD_ERROR]: ITorrentDownloadError
  [LauncherEvent.TORRENT_DOWNLOAD_SETUP]: ITorrentData
  [LauncherEvent.TORRENT_GET_ERROR]: ITorrentData
  [LauncherEvent.SYSTEM_NOT_SUPPORTED_ERROR]: null
}
