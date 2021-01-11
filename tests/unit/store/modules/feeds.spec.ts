import { createLocalVue } from '@vue/test-utils'
import type { Store } from 'vuex'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import nock from 'nock'

import type { IFeedState } from '@/views/store/modules/feeds'
import { feedsModule } from '@/views/store/modules/feeds'

import feedsStub from './stubs/feeds.json'

describe('feeds module', () => {
  let store: Store<{ feeds: IFeedState }>
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    store = new Vuex.Store({ modules: { feeds: cloneDeep(feedsModule) } })

    nock.cleanAll()
  })

  it('correct feeds from request', async () => {
    nock('https://api.sirus.su/api').get('/news').reply(200, feedsStub)

    await store.dispatch('feeds/getFeeds')

    expect(Object.keys(store.getters)).toContain('feeds/feeds')
    expect(store.getters['feeds/feeds']).toHaveLength(feedsStub.data.length)
  })
})
