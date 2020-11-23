export enum LauncherEvent {
  OPEN_SELECT_GAME_DIRECTORY_DIALOG = 'OPEN_SELECT_GAME_DIRECTORY_DIALOG',
  SELECT_GAME_DIRECTORY = 'SELECT_GAME_DIRECTORY',
  WRONG_GAME_DIRECTORY_SELECTED = 'WRONG_GAME_DIRECTORY_SELECTED',
  CAN_LAUNCH_GAME = 'CAN_LAUNCH_GAME',
  LAUNCH_GAME = 'LAUNCH_GAME',
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

export type EventData = {
  // TODO: implemment Data by Event correctly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [e in LauncherEvent]?:
    | IWrongGameDirectorySelectedData
    | ISelectGameDirectoryData
    | IHasClientReadyData
    | ILaunchGame
    | null
}
