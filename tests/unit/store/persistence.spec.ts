import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import { appModule } from '@/views/store/modules/app'
import { vuexPersist } from '@/views/store/persistance'
import { settingsModule } from '@/views/store/modules/settings'

describe('File list receive', () => {
  let store
  let localVue

  const FILES = [
    {
      filename: 'patch-d.zip',
      path: '/Data/',
      size: 174954589,
      md5: '393ABCBA77B8E369DD83109CBA76A285',
      host: 'http://51.15.228.31:8080/api/client/patches/',
      storagePath: '/new-live/',
      updatedAt: '2019-06-05',
    },
  ]

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    localStorage.clear()
    // @ts-ignore
    localStorage.setItem.mockClear()
  })

  it('check persistence with class', () => {
    localStorage.setItem(
      'vuex',
      JSON.stringify({
        app: {
          launcherFiles: FILES,
        },
      })
    )

    store = new Vuex.Store({
      modules: {
        app: cloneDeep(appModule),
        settings: cloneDeep(settingsModule),
      },
      plugins: [vuexPersist.plugin],
    })

    expect(store.state.app.launcherFiles.length).toBe(FILES.length)
  })
})
