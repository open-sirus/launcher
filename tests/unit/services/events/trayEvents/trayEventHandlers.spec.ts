import { mocked } from 'ts-jest/utils'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import {
  onMinimize,
  onRestore,
  onCanLaunchGame,
} from '@/background/tray/trayEventHandlers'
import EventBus from '@/services/EventBus'
import RenderedIpc from '@/events/ipcs/RenderedIpc'
import { DirectorySelected } from '@/events/ClientActions'
import { settingsModule } from '@/store/modules/settings'

jest.mock('@/events/ipcs/RenderedIpc')
jest.mock('@/events/ClientActions')

describe('tray event handlers', () => {
  const MockedIpc = mocked(RenderedIpc, true)
  const MockedDirectorySelected = mocked(DirectorySelected, true)
  let ipc, bus, store

  beforeEach(() => {
    MockedIpc.mockClear()
    MockedDirectorySelected.mockClear()

    store = new Vuex.Store({
      modules: {
        settings: cloneDeep(settingsModule),
      },
    })
  })

  test('onMinimize', () => {})

  test('onRestore', () => {})

  test('onCanLaunchGame', () => {
    ipc = new RenderedIpc()
    bus = new EventBus(ipc)
  })
})
