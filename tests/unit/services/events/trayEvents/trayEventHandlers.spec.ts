// TODO: TEST NOT WORKING!!!!!
import { BrowserWindow } from 'electron'
import { mocked } from 'ts-jest/utils'

import { eventListeners } from '@/background/tray/trayEventHandlers'

jest.mock('electron', () => {
  return {
    BrowserWindow: jest.fn(() => {
      return {
        on: jest.fn(),
      }
    }),
  }
})

let onCanLaunchGameSpy, onMinimizeSpy, onRestoreSpy, win

describe('tray event handlers', () => {
  const mockBrowserWindow = mocked(BrowserWindow, true)

  beforeAll(() => {
    onCanLaunchGameSpy = jest.spyOn(eventListeners, 'onCanLaunchGame')
    onMinimizeSpy = jest.spyOn(eventListeners, 'onMinimize')
    onRestoreSpy = jest.spyOn(eventListeners, 'onRestore')
  })

  beforeEach(() => {
    mockBrowserWindow.mockClear()
  })

  afterAll(() => {
    onCanLaunchGameSpy.mockRestore()
    onMinimizeSpy.mockRestore()
    onRestoreSpy.mockRestore()
  })

  test('onMinimize', () => {
    win = new BrowserWindow()

    win.on('minimize', eventListeners.onMinimize)

    expect(onMinimizeSpy).toBeCalled()
  })
})
