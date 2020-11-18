import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  Tray,
} from 'electron'

import { IEventData } from '@/background/tray/types'
import eventService from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'

export const buildMenuFromTemplate = (
  template: Array<MenuItemConstructorOptions | MenuItem>
): Menu => {
  return Menu.buildFromTemplate(template)
}

export const initialContextMenu = (mainWindow: BrowserWindow): Menu =>
  buildMenuFromTemplate([
    {
      id: '1',
      enabled: false,
      type: 'normal',
      label: 'В игру',
      click: () => {
        eventService.emit(LauncherEvent.RUN_GAME, { runGame: true })
      },
    },
    { id: '2', type: 'separator' },
    {
      id: '3',
      type: 'normal',
      label: 'Свернуть',
      click: () => mainWindow.minimize(),
    },
    {
      id: '4',
      enabled: true,
      type: 'normal',
      label: 'Закрыть лаунчер',
      click: () => app.quit(),
    },
  ])

export const reBuildMenu = (eventData: IEventData, menu: Menu, tray: Tray) => {
  const menuItem = new MenuItem(eventData)

  const filteredMenuItems = menu.items.filter((item) => item.id !== menuItem.id)
  const filteredMenu = buildMenuFromTemplate(filteredMenuItems)
  filteredMenu.insert(Number(menuItem.id) - 1, menuItem)

  tray.setContextMenu(filteredMenu)
}
