import { app, BrowserWindow, Menu, MenuItem, Tray } from 'electron'

import { IMenuItem, menuComponentTypes } from '@/background/tray/types'
import eventService from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { MENU_ORDER } from '@/constants'

export const initialContextMenu = (mainWindow: BrowserWindow): Menu => {
  const template: Array<IMenuItem> = [
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
      label: '',
      type: 'separator',
      click: () => {},
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
export const buildMenu = (eventData: IMenuItem, menu: Menu, tray: Tray) => {
  const menuItem = new MenuItem(eventData)

  // TODO: Fix typescript errors
  // @ts-ignore
  const filteredMenuItems = menu.items.filter((item) => item.nodeType !== menuItem.nodeType)
  const filteredMenu = Menu.buildFromTemplate(filteredMenuItems)
  // @ts-ignore
  const menuItemIndex = MENU_ORDER.findIndex(menuItemType => menuItemType === menuItem.nodeType)
  filteredMenu.insert(menuItemIndex, menuItem)

  tray.setContextMenu(filteredMenu)
}
