import Vue from 'vue'
import VueRouter from 'vue-router'

import Feeds from '@/views/pages/Feeds.vue'
import Settings from '@/views/pages/Settings.vue'
import Accounts from '@/views/pages/Accounts.vue'
import Profile from '@/views/pages/Profile.vue'
import ClientUpdate from '@/views/pages/ClientUpdate.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Feeds',
    component: Feeds,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/update',
    name: 'Client Updates',
    component: ClientUpdate,
  },
]

export const getRouter = () =>
  new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes,
  })
