import path from 'path'

import { IS_DEVELOPMENT } from '@/constants'

export const getIconPath = (): string => {
  let icon: string

  if (!IS_DEVELOPMENT) {
    icon = path.dirname(process.execPath)
  } else {
    icon = path.resolve('.')
  }

  icon = path.resolve(icon + '/public/icon.png')

  return icon
}
