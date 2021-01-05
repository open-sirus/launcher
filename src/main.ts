import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import '@/assets/app.scss'

import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuelidate from 'vuelidate'

import { Interop } from '@/views/plugins/interop'
import { Notification } from '@/views/plugins/norifications'
import * as clientActions from '@/events/ClientActions'

import { i18n, initI18n } from './views/modules/i18n'
import { initVuetify } from './views/modules/vuetify'
import store from './views/store'
import router from './views/router'
import App from './views/App.vue'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(Interop)
Vue.use(Notification, { store })
Vue.use(Vuelidate)

initI18n()

new Vue({
  router,
  store,
  vuetify: initVuetify(),
  i18n,
  created() {
    clientActions.init()
  },
  render: (h) => h(App),
}).$mount('#app')
