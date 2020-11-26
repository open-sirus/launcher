import { app } from 'electron'
import { mocked } from 'ts-jest/utils'

import RenderedIpc from '@/events/ipcs/RenderedIpc'
import EventBus from '@/services/EventBus'
import { StartOnSystemStartup } from '@/background/ClientActions'
import { LauncherEvent } from '@/events/LauncherEvent'

jest.mock('@/events/ipcs/RenderedIpc')
jest.mock('@/background/ClientActions')
jest.mock('electron', () => {
  return {
    app: {
      setLoginItemSettings: jest.fn(),
    },
  }
})

describe('start on system startup', () => {
  const MockedIpc = mocked(RenderedIpc, true)
  const MockedStartOnSystemStartup = mocked(StartOnSystemStartup, true)

  beforeEach(() => {
    MockedIpc.mockClear()
    MockedStartOnSystemStartup.mockClear()
  })

  test('handle with correct data', () => {
    const ipc = new RenderedIpc()
    const bus = new EventBus(ipc)
    const listener = new StartOnSystemStartup()
    const data = { isStartOnSystemStartup: true }

    spyOn(app, 'setLoginItemSettings')

    bus.on(LauncherEvent.SET_START_ON_SYSTEM_STARTUP, listener)

    bus.emit(LauncherEvent.SET_START_ON_SYSTEM_STARTUP, { ...data })

    expect(
      listener.handle
    ).toBeCalledWith(LauncherEvent.SET_START_ON_SYSTEM_STARTUP, { ...data })
    // TODO: Test don't work!
    expect(app.setLoginItemSettings).toBeCalledWith({
      openAtLogin: true,
      openAsHidden: true,
    })
  })
})
