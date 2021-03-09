<template>
  <v-container>
    <v-row dense v-ripple class="mb-1" justify="space-around" align="center">
      <v-col order="1">Profile</v-col>
      <v-col order="2">{{ profile.username }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import type {
  IAccountsActions,
  IAccountsGetters,
  IAccountsState,
} from '@/views/store/modules/accounts/types'

const { useGetters: useAccountsGetters } = createNamespacedHelpers<
  IAccountsState,
  IAccountsGetters,
  IAccountsActions
>('accounts')

export default defineComponent({
  setup() {
    const { defaultAccount } = useAccountsGetters(['defaultAccount'])
    const profile = defaultAccount.value.accountInfo

    return {
      profile,
    }
  },
})
</script>
