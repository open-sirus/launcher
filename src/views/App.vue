<template>
  <v-app>
    <status-bar-block />
    <template v-if="isWelcomeScreenCompleted">
      <navigation />
      <notifications />
      <v-main>
        <transition name="slide">
          <router-view />
        </transition>
      </v-main>
    </template>
    <welcome-screen v-else />
  </v-app>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import type {
  IWelcomeGetters,
  IWelcomeState,
} from '@/views/store/modules/welcome'
import type {
  IAccountsActions,
  IAccountsState,
} from '@/views/store/modules/accounts/types'
import type {
  ISettingsActions,
  ISettingsState,
} from '@/views/store/modules/settings'

import Navigation from './components/common/Navigation.vue'
import StatusBarBlock from './blocks/StatusBarBlock.vue'
import Notifications from './components/notifications/Notifications.vue'
import WelcomeScreen from './WelcomeScreen.vue'

const { useGetters: useWelcomeGetters } = createNamespacedHelpers<
  IWelcomeState,
  IWelcomeGetters
>('welcome')

const { useActions: useAccountsActions } = createNamespacedHelpers<
  IAccountsState,
  IAccountsActions
>('accounts')

const { useActions: useSettingsActions } = createNamespacedHelpers<
  ISettingsState,
  ISettingsActions
>('settings')

export default defineComponent({
  components: {
    Notifications,
    Navigation,
    StatusBarBlock,
    WelcomeScreen,
  },
  setup() {
    const { isCompleted: isWelcomeScreenCompleted } = useWelcomeGetters([
      'isCompleted',
    ])

    const { validateAccounts } = useAccountsActions(['validateAccounts'])

    const { setIsFirstStart } = useSettingsActions(['setIsFirstStart'])

    validateAccounts()
    setIsFirstStart()

    return {
      isWelcomeScreenCompleted,
    }
  },
})
</script>

<style>
html {
  overflow-y: auto;
}

.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
