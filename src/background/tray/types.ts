import { MenuItem, MenuItemConstructorOptions } from 'electron'

export const enum menuComponentTypes {
  LAUNCH_GAME = 'LAUNCH_GAME',
  SEPARATOR = 'SEPARATOR',
  SHOW_HIDE_APP = 'SHOW_HIDE_APP',
  CLOSE_APP = 'CLOSE_APP',
}

export interface IMenuItemConstructorOptions
  extends MenuItemConstructorOptions {
  nodeType: menuComponentTypes
}

export interface IMenuItem extends MenuItem {
  nodeType?: menuComponentTypes
}
