<template>
  <div>
    <v-container class="accounts-block">
      <v-row
        v-for="account in accounts"
        :key="account.id"
        :class="{ 'row-active': setActiveClass(account) }"
        dense
        v-ripple
        class="mb-1"
        justify="space-around"
        align="center"
      >
        <v-col cols="8" order="1" class="accounts-block__main-btn">
          <v-btn
            pa-0
            block
            text
            tile
            :disabled="account.tokenIsExpired"
            @click.stop="setDefaultAccount(account)"
            :ripple="false"
          >
            <v-col cols="1" order="1" class="pl-0 ml-n3">
              <v-icon v-if="defaultAccount.id === account.id">
                mdi-account-check
              </v-icon>
            </v-col>

            <v-col cols="auto" order="2">
              {{ account.username }}
            </v-col>

            <v-col order="3">
              <v-spacer />
            </v-col>
          </v-btn>
        </v-col>
        <v-col cols="auto" order="2">
          <v-btn
            v-if="account.tokenIsExpired"
            text
            @click.stop="reLogin('', account)"
            tile
          >
            <template #default>
              {{ $t('accounts.re_login') }}
            </template>
          </v-btn>
          <v-btn v-else text @click.stop="removeAccount(account.id)" tile>
            <template #default>
              {{ $t('accounts.remove_account') }}
            </template>
          </v-btn>
        </v-col>
      </v-row>
      <accounts-modal
        :can-show-modal="canShowModal"
        :can-show-progress-bar="canShowProgressBar"
        @auth-requested="sendRequest"
        @open-accounts-modal="showModal"
        @close-accounts-modal="hideModal"
      />
      <tfa-modal
        :tfa="needTfa"
        :can-show-progress-bar="canShowProgressBar"
        @tfa-was-entered="sendRequestWithTfa"
        @clear-tfa-form="closeTfaForm"
      />
    </v-container>
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import AccountsModal from '@/views/components/accounts/AccountsModal.vue'
import TfaModal from '@/views/components/accounts/TfaModal.vue'
import type {
  IAccount,
  IAccountsActions,
  IAccountsGetters,
  IAccountsState,
} from '@/views/store/modules/accounts/types'
import { RequestStatus } from '@/types/network'

const {
  useGetters: useAccountsGetters,
  useActions: useAccountsActions,
} = createNamespacedHelpers<IAccountsState, IAccountsGetters, IAccountsActions>(
  'accounts'
)

export default defineComponent({
  components: { AccountsModal, TfaModal },
  setup() {
    const {
      setDefaultAccount,
      removeAccount,
      sendAuthRequest,
      closeTfaModal,
    } = useAccountsActions([
      'setDefaultAccount',
      'removeAccount',
      'sendAuthRequest',
      'closeTfaModal',
    ])

    const {
      defaultAccount,
      accounts,
      needTfa,
      requestStatus,
    } = useAccountsGetters([
      'defaultAccount',
      'accounts',
      'needTfa',
      'requestStatus',
    ])

    const canShowModal = false

    return {
      accounts,
      defaultAccount,
      needTfa,
      setDefaultAccount,
      removeAccount,
      sendAuthRequest,
      requestStatus,
      closeTfaModal,
      canShowModal,
    }
  },
  computed: {
    canShowProgressBar(): boolean {
      return this.requestStatus === RequestStatus.PENDING
    },
    canCloseModal(): boolean {
      return (
        this.requestStatus !== RequestStatus.FAILED ||
        this.needTfa.needTfa === true
      )
    },
  },
  methods: {
    async sendRequest({
      username,
      password,
      token,
    }: {
      username: string
      password: string
      token?: string
    }) {
      await this.sendAuthRequest({
        username,
        password,
        token,
        isReLogin: false,
      })

      if (this.canCloseModal) {
        this.hideModal()
      }
    },
    async sendRequestWithTfa(tfaToken: string) {
      if (this.needTfa.isReLogin) {
        await this.reLogin(tfaToken)

        return
      }

      await this.sendAuthRequest({
        username: this.needTfa.username,
        password: this.needTfa.password,
        token: tfaToken,
        isReLogin: false,
      })
    },
    async reLogin(tfaToken?: string, account?: IAccount) {
      if (!tfaToken && account) {
        await this.sendAuthRequest({
          username: account.username,
          password: account.password,
          token: account.tfaToken,
          isReLogin: true,
        })
      }

      if (tfaToken && !account) {
        await this.sendAuthRequest({
          username: this.needTfa.username,
          password: this.needTfa.password,
          token: tfaToken,
          isReLogin: true,
        })
      }
    },
    closeTfaForm() {
      this.closeTfaModal()
    },
    setActiveClass(account: IAccount): boolean {
      return this.defaultAccount.id === account.id && !account.tokenIsExpired
    },
    switchModalToggle(toggle: boolean) {
      this.canShowModal = toggle
    },
    showModal() {
      this.switchModalToggle(true)
    },
    hideModal() {
      this.switchModalToggle(false)
    },
  },
})
</script>

<style scoped>
.accounts-block .row-active {
  background-color: rgba(255, 255, 255, 0.24);
}
.accounts-block .row-active:hover {
  background-color: rgba(255, 255, 255, 0.24) !important;
}
.accounts-block .row:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.accounts-block__main-btn .theme--dark.v-btn:hover::before {
  opacity: 0;
}
</style>
