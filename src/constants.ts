import { menuComponentTypes } from '@/background/tray/types'

// notifications
export const REMOVE_NOTIFICATION_TIMEOUT = 4 * 1000
export const NOTIFICATION_TITLE = 'Sirus Launcher'
// accounts
export const VERIFY_ACCOUNTS_TIMEOUT = 24 * 60 * 60 * 1000
// background
export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
// tray
export const MENU_ORDER = [
  menuComponentTypes.LAUNCH_GAME,
  menuComponentTypes.SEPARATOR,
  menuComponentTypes.SHOW_HIDE_APP,
  menuComponentTypes.CLOSE_APP,
]
