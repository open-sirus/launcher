import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

import { Interop } from '@/views/plugins/interop'
import { Notification } from '@/views/plugins/norifications'
import * as clientActions from '@/events/ClientActions'

import { i18n, initI18n } from './views/modules/i18n'
import { initVuetify } from './views/modules/vuetify'
import { getStore } from './views/store'
import { getRouter } from './views/router'
import App from './views/App.vue'

export const initApp = () => {
  const store = getStore()
  const router = getRouter()

  Vue.config.productionTip = false

  Vue.use(VueCompositionAPI)
  Vue.use(Interop)
  Vue.use(Notification, { store })

  initI18n()

  return new Vue({
    router,
    store,
    vuetify: initVuetify(),
    i18n,
    created() {
      clientActions.init(store)
    },
    render: (h) => h(App),
  }).$mount('#app')
}
