import { createLocalVue } from '@vue/test-utils'
import Vuex, { Store } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import nock from 'nock'
import { mocked } from 'ts-jest/utils'

import { appModule, IAppState } from '@/views/store/modules/app'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { IFile } from '@/types/files'
import LauncherFile from '@/entities/LauncherFile'

jest.mock('@/services/EventService')

describe('File list receive', () => {
  let store: Store<{ app: IAppState }>
  let localVue
  const baseURL = 'https://api.sirus.su'

  const RESPONSE: { patches: Array<IFile>; delete: Array<IFile> } = {
    patches: [
      {
        filename: 'patch-d.zip',
        path: '/Data/',
        size: 174954589,
        md5: '393ABCBA77B8E369DD83109CBA76A285',
        host: 'http://51.15.228.31:8080/api/client/patches/',
        storagePath: '/new-live/',
        updatedAt: '2019-06-05',
      },
      {
        filename: 'patch-ruRU-6.zip',
        path: '/Data/ruRU/',
        size: 25191304,
        md5: '0522CA7960F8E3D7CB445D5CF109E682',
        host: 'http://51.15.228.31:8080/api/client/patches/',
        storagePath: '/new-live/',
        updatedAt: '2020-04-16',
      },
      {
        filename: 'run.exe',
        path: '/',
        size: 7704216,
        md5: '45DF7FF8670ABBD6A8F2A590B4B0CCF4',
        host: 'http://51.15.228.31:8080/api/client/patches/',
        storagePath: '/new-live/',
        updatedAt: '2019-05-14',
      },
    ],
    delete: [
      {
        id: 84,
        path: '/Data/ruRU/patch-ruRU-h.zip',
        status: 1,
        isNew: true,
        createdAt: '2017-02-11',
        updatedAt: '2017-02-11',
        new: true,
      },
      {
        id: 85,
        path: '/Data/ruRU/patch-ruRU-k.zip',
        status: 1,
        isNew: true,
        createdAt: '2017-02-11',
        updatedAt: '2017-02-11',
        new: true,
      },
      {
        id: 86,
        path: '/Data/patch-k.zip',
        status: 1,
        isNew: true,
        createdAt: '2017-02-11',
        updatedAt: '2017-02-11',
        new: true,
      },
    ],
  }

  let incompleteFiles: [LauncherFile, LauncherFile] | [] = []

  const MockedEventService = mocked(eventService, true)

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    const INCOMPLETE_FILE = LauncherFile.fromObject(RESPONSE.patches[0])
    INCOMPLETE_FILE.isDownloading = true
    const INCOMPLETE_FILE_2 = LauncherFile.fromObject(RESPONSE.patches[1])
    INCOMPLETE_FILE_2.isIncomplete = true

    incompleteFiles = [INCOMPLETE_FILE, INCOMPLETE_FILE_2]

    store = new Vuex.Store({ modules: { app: cloneDeep(appModule) } })

    MockedEventService.emit.mockClear()

    nock.cleanAll()
  })

  it.skip('load file list from server', async () => {
    // TODO: Remove cases to separated file store
    nock(baseURL)
      .get('/api/client/patches')
      .reply(200, { data: { data: RESPONSE } })

    await store.dispatch('app/loadFiles', null, { root: true })
    expect(store.state.app.files).toStrictEqual(
      RESPONSE.patches.map(LauncherFile.fromObject)
    )
    expect(store.state.app.filesToRemove).toStrictEqual(RESPONSE.delete)
  })

  it.skip('cleanup incomplete downloads after restart', async () => {
    store.commit('app/SET_LAUNCHER_FILES', incompleteFiles)

    expect(
      store.state.app.launcherFiles.filter((f) => f.isIncomplete).length
    ).toBe(1)

    store.dispatch('app/initialStart', null, { root: true })

    expect(
      store.state.app.launcherFiles.filter((f) => f.isIncomplete).length
    ).toBe(2)
    expect(
      store.state.app.launcherFiles.filter((f) => f.isDownloading).length
    ).toBe(0)
  })

  it.skip('list should not be changed if error occurred', async () => {
    store.commit('app/SET_FILES', RESPONSE.patches.map(LauncherFile.fromObject))

    nock(baseURL)
      .get('/api/client/patches')
      .reply(500, { error: 'Internal server error' })

    try {
      await store.dispatch('loadFiles')
      expect(false).toBe(true)
    } catch (e) {
      expect(e.message).toBe('Request failed with status code 500')
    }

    expect(store.state.app.files).toStrictEqual(RESPONSE.patches)
  })

  it('event should not be emitted if file list the same', async () => {
    expect.assertions(1)
    store.commit('app/SET_FILES', RESPONSE.patches.map(LauncherFile.fromObject))

    nock('https://api.sirus.su/')
      .get('/api/client/patches')
      .reply(200, RESPONSE)

    await store.dispatch('app/loadFiles')
    expect(MockedEventService.emit).not.toBeCalled()
  })

  it('event should be emitted if list of files was empty', async () => {
    expect.assertions(1)

    nock('https://api.sirus.su/')
      .get('/api/client/patches')
      .reply(200, RESPONSE)

    await store.dispatch('app/loadFiles')
    expect(MockedEventService.emit).toBeCalledWith(
      LauncherEvent.FILE_LIST_UPDATED,
      RESPONSE.patches
    )
  })

  it('event should be emitted if list of files has different size', async () => {
    store.commit('app/SET_FILES', RESPONSE.patches)
    expect.assertions(1)

    const patches = [RESPONSE.patches[0], RESPONSE.patches[1]]

    nock('https://api.sirus.su/')
      .get('/api/client/patches')
      .reply(200, { patches, delete: RESPONSE.delete })

    await store.dispatch('app/loadFiles')
    expect(MockedEventService.emit).toBeCalledWith(
      LauncherEvent.FILE_LIST_UPDATED,
      patches
    )
  })

  it('event should be emitted if one of fields changed', async () => {
    store.commit('app/SET_FILES', RESPONSE.patches)
    expect.assertions(1)

    const patches = [...RESPONSE.patches]
    patches[0] = { ...patches[0], md5: '393ABCBA77B8E369DD83XXXXXXXXX' }

    nock('https://api.sirus.su/')
      .get('/api/client/patches')
      .reply(200, { patches, delete: RESPONSE.delete })

    await store.dispatch('app/loadFiles')
    expect(MockedEventService.emit).toBeCalledWith(
      LauncherEvent.FILE_LIST_UPDATED,
      patches
    )
  })
})
