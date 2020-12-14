import path from 'path'
import { nativeImage } from 'electron'

import { IS_DEVELOPMENT } from '@/constants'

const getIconPath = (): string => {
  let icon: string

  if (!IS_DEVELOPMENT) {
    icon = path.dirname(process.execPath)
    icon = path.resolve(icon + '/resources/public/icon.png')
  } else {
    icon = path.resolve('.')
    icon = path.resolve(icon + '/public/icon.png')
  }

  return icon
}

export const createImageFromPath = (): nativeImage => {
  return nativeImage.createFromPath(getIconPath())
}
