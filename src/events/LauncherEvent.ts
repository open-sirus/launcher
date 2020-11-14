export enum LauncherEvent {
  OPEN_SELECT_GAME_DIRECTORY_DIALOG = 'OPEN_SELECT_GAME_DIRECTORY_DIALOG',
  SELECT_GAME_DIRECTORY = 'SELECT_GAME_DIRECTORY',
  WRONG_GAME_DIRECTORY_SELECTED = 'WRONG_GAME_DIRECTORY_SELECTED',
}

export interface IWrongGameDirectorySelectedData {
  directory: string | null
}

export interface ISelectGameDirectoryData {
  directory: string | null
}

export type EventData = {
  // TODO: implemment Data by Event correctly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [e in LauncherEvent]?:
    | IWrongGameDirectorySelectedData
    | ISelectGameDirectoryData
    | null
}
