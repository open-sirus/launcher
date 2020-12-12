<template>
  <v-navigation-drawer
    app
    clipped
    mobile-breakpoint="0"
    :value="true"
    width="220"
    floating
  >
    <v-list dense>
      <v-list-item to="/">
        <v-list-item-action>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.news') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/accounts">
        <v-list-item-action>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.accounts') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="hasDefaultAccount" to="/profile">
        <v-list-item-action>
          <v-icon>mdi-account</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ username }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/update">
        <v-list-item-action>
          <v-icon>mdi-progress-download</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.updates') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/settings">
        <v-list-item-action>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ $t('sidebar.settings') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import upperFirst from 'lodash/upperFirst'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import type {
  IAccount,
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

    return {
      defaultAccount,
    }
  },
  computed: {
    hasDefaultAccount() {
      return Boolean(this.defaultAccount)
    },
    username() {
      return upperFirst((this.defaultAccount as IAccount).username)
    },
  },
})
</script>
