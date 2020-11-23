import { MenuItemConstructorOptions } from 'electron'

export enum menuComponentTypes {
  LAUNCH_GAME = 'LAUNCH_GAME',
  SEPARATOR = 'SEPARATOR',
  SHOW_HIDE_APP = 'SHOW_HIDE_APP',
  CLOSE_APP = 'CLOSE_APP',
}

export interface IMenuItem extends MenuItemConstructorOptions {
  enabled: boolean
  type: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio'
  label: string
  click: () => void
  nodeType: menuComponentTypes
}
