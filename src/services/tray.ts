import { Tray, Menu, MenuItemConstructorOptions } from 'electron'
import path from 'path'

// TODO: need to implement tray event-bus for click events
const isAppShown = (): boolean => {
  return true
}

const canRunGame = (): boolean => {
  return false
}

const isProductionMode = process.env.NODE_ENV === 'production'

const getIconPath = (isProductionMode: boolean): string => {
  let icon: string

  if (isProductionMode) {
    icon = path.dirname(process.execPath)
  } else {
    icon = path.resolve('.')
  }

  icon = path.resolve(icon + '/public/icon.png')

  return icon
}

export const buildMenu = (
  isAppShown: () => boolean,
  canRunGame: () => boolean,
  tray?: Tray
): Menu | null => {
  const menuTemplate: Array<MenuItemConstructorOptions> = [
    {
      enabled: canRunGame(),
      type: 'normal',
      label: 'В игру',
      click: () => {
        console.log(`run game`)
      },
    },
    { enabled: true, type: 'separator' },
    {
      enabled: true,
      type: 'normal',
      label: isAppShown() ? 'Свернуть' : 'Развернуть',
      click: () => {
        console.log(`show/hide app`)
      },
    },
    {
      enabled: true,
      type: 'normal',
      label: 'Выйти',
      click: () => {
        console.log(`close launcher`)
      },
    },
  ]

  if (tray) {
    const rebuildMenu = Menu.buildFromTemplate(menuTemplate)

    tray.setContextMenu(rebuildMenu)

    return null
  }

  return Menu.buildFromTemplate(menuTemplate)
}

export const buildTray = (): Tray => {
  const tray: Tray = new Tray(getIconPath(isProductionMode))

  tray.setContextMenu(buildMenu(isAppShown, canRunGame))
  tray.setToolTip('Sirus launcher')

  return tray
}
