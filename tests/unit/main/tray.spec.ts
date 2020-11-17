import { Tray } from 'electron'

import { buildTray } from '@/background/tray'

describe('Tray', () => {
  let winId = 1


  test('return correct instance of Tray', () => {
    const tray = buildTray(winId)

    expect(tray).toBeInstanceOf(Tray)
  })
})
