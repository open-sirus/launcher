import { Tray, Menu, MenuItemConstructorOptions } from 'electron'

// TODO: need to implement tray event-bus for click events
const isAppShown = (): boolean => {
  return true
}

const canRunGame = (): boolean => {
  return false
}

const getIconPath = (): string => {
  return '/home/vylor/WebstormProjects/launcher/public/icon.png'
}

export const buildMenu = (isAppShown: () => boolean, canRunGame: () => boolean, tray?: Tray): Menu | null => {
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
      }
    },
    {
      enabled: true,
      type: 'normal',
      label: 'Выйти',
      click: () => {
        console.log(`close launcher`)
      }
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
  const tray: Tray = new Tray(getIconPath())

  tray.setContextMenu(buildMenu(isAppShown, canRunGame))
  tray.setToolTip('Sirus launcher')

  return tray
}
