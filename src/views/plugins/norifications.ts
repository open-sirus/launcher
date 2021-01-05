/* eslint-disable @typescript-eslint/naming-convention */
import _Vue from 'vue'
import * as Vuex from 'vuex'

import { INotification } from '@/types/notification'
import { INotificationState } from '@/views/store/modules/notification'

export interface INotificationPlugin {
  getAll: () => Array<INotification>
  add: (payload: INotification) => void
  remove: (id: string) => void
  get: (id: string) => INotification
  getPayload: (id: string) => INotification['payload']
}

export function Notification(
  Vue: typeof _Vue,
  { store }: { store: Vuex.Store<{ notification: INotificationState }> }
): void {
  const notification: INotificationPlugin = {
    getAll() {
      return store.getters['notification/notifications']
    },
    add({ type, text, payload }) {
      store.dispatch('notification/addNotification', {
        type,
        text,
        payload,
      })
    },
    remove(id) {
      store.dispatch('notification/removeNotification', id)
    },
    get(id) {
      return store.getters['notification/getNotification'](id)
    },
    getPayload(id) {
      return store.getters['notification/getNotificationPayload'](id)
    },
  }

  Vue.prototype.$notification = notification
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Vue {
    $notification: INotificationPlugin
  }
}
