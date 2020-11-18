import path from 'path'
import { BrowserWindow } from 'electron'

import { isDevelopment } from '@/background'

export const getMainWindowById = (winId: number): BrowserWindow => {
  return BrowserWindow.fromId(winId)
}

export const getIconPath = (): string => {
  let icon: string

  if (!isDevelopment) {
    icon = path.dirname(process.execPath)
  } else {
    icon = path.resolve('.')
  }

  icon = path.resolve(icon + '/public/icon.png')

  return icon
}
