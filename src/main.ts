import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import '@/assets/app.scss'

import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import Vuelidate from 'vuelidate'

import { Interop } from '@/plugins/interop'
import { Notification } from '@/plugins/norifications'
import * as clientActions from '@/events/ClientActions'

import { i18n } from './modules/i18n'
import { initVuetify } from './modules/vuetify'
import store from './store'
import router from './router'
import App from './views/App.vue'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(Interop)
Vue.use(Notification, { store })
Vue.use(Vuelidate)

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
