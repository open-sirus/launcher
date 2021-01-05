import { ipcRenderer } from 'electron'
import { mocked } from 'ts-jest/utils'
import { createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import { ISettingsState, settingsModule } from '@/views/store/modules/settings'

jest.mock('electron', () => {
  return {
    ipcRenderer: {
      on: jest.fn(),
      send: jest.fn(),
    },
  }
})

describe('settings module', () => {
  const mockedIpc = mocked(ipcRenderer, true)

  let store: Store<{ settings: ISettingsState }>
  let localVue

  beforeEach(() => {
    mockedIpc.send.mockClear()
    mockedIpc.on.mockClear()

    localVue = createLocalVue()
    localVue.use(Vuex)

    store = new Vuex.Store({
      modules: {
        settings: cloneDeep(settingsModule),
      },
    })
  })
  test('set true start on system startup', async () => {
    await store.dispatch('settings/setStartOnSystemStartup', true)

    expect(store.getters['settings/startOnSystemStartup']).toBe(true)
  })

  test('set false start on system startup', async () => {
    await store.dispatch('settings/setStartOnSystemStartup', false)

    expect(store.getters['settings/startOnSystemStartup']).toBe(false)
  })

  test('set true start on system startup in minimized mode', async () => {
    await store.dispatch('settings/setStartInMinimizedMode', true)

    expect(store.getters['settings/startInMinimizedMode']).toBe(true)
  })

  test('set false start on system startup in minimized mode', async () => {
    await store.dispatch('settings/setStartInMinimizedMode', false)

    expect(store.getters['settings/startInMinimizedMode']).toBe(false)
  })
})
