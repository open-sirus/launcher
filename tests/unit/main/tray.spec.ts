import { Tray } from 'electron'
import { mocked } from 'ts-jest/utils'

import { initTray } from '@/background/tray'

describe('Tray', () => {
  const winId = 1
  const mockedTray = mocked(Tray, true)

  test('return correct instance of Tray', () => {
    const tray = initTray(winId)

    expect(tray).toBeInstanceOf(mockedTray)
  })
})
