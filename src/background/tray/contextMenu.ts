import type { BrowserWindow, Tray } from 'electron'
import { app, Menu, MenuItem } from 'electron'

import type {
  IMenuItem,
  IMenuItemConstructorOptions,
} from '@/background/tray/types'
import { menuComponentTypes } from '@/background/tray/types'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { MENU_ORDER } from '@/constants'

export const initContextMenu = (mainWindow: BrowserWindow): Menu => {
  const template: Array<IMenuItemConstructorOptions> = [
    {
      enabled: false,
      type: 'normal',
      label: 'В игру',
      click: () => {
        eventService.emit(LauncherEvent.LAUNCH_GAME, { launchGame: true })
      },
      nodeType: menuComponentTypes.LAUNCH_GAME,
    },
    {
      enabled: true,
      type: 'separator',
      nodeType: menuComponentTypes.SEPARATOR,
    },
    {
      enabled: true,
      type: 'normal',
      label: 'Свернуть',
      click: () => mainWindow.minimize(),
      nodeType: menuComponentTypes.SHOW_HIDE_APP,
    },
    {
      enabled: true,
      type: 'normal',
      label: 'Закрыть лаунчер',
      click: () => app.quit(),
      nodeType: menuComponentTypes.CLOSE_APP,
    },
  ]

  return Menu.buildFromTemplate(template)
}
export const buildMenu = (
  eventData: IMenuItemConstructorOptions,
  menu: Menu,
  tray: Tray
) => {
  const menuItem: IMenuItem = new MenuItem(eventData)

  const filteredMenuItems = (menu.items as IMenuItem[]).filter(
    (item) => item.nodeType !== menuItem.nodeType
  )
  const filteredMenu = Menu.buildFromTemplate(filteredMenuItems)
  const menuItemIndex = MENU_ORDER.findIndex(
    (menuItemType) => menuItemType === menuItem.nodeType
  )
  filteredMenu.insert(menuItemIndex, menuItem)

  tray.setContextMenu(filteredMenu)
}
