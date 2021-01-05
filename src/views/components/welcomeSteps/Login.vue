<template>
  <v-card class="login-step">
    <template v-if="hasSettedAccount">
      <v-card-title>
        {{ $t('steps.login.loggined', { username: defaultAccount.username }) }}
      </v-card-title>
    </template>
    <template v-else>
      <v-card-title>
        <span class="headline">{{ $t('steps.login.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container pt-0 pb-0>
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model.lazy="validate.authForm.login.$model"
                :error-messages="loginError"
                :disabled="canShowProgressBar"
                autofocus
                required
              >
                <template #label> {{ $t('steps.login.username') }}* </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <v-text-field
                type="password"
                v-model.lazy="validate.authForm.pass.$model"
                :error-messages="passwordError"
                :disabled="canShowProgressBar"
                required
              >
                <template #label> {{ $t('steps.login.password') }}* </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>{{ $t('steps.login.req_fields') }}</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="sendRequest"
          :disabled="validate.authForm.$invalid || canShowProgressBar"
        >
          {{ $t('steps.login.login') }}
        </v-btn>
      </v-card-actions>
      <tfa-modal
        :tfa="needTfa"
        :can-show-progress-bar="canShowProgressBar"
        @tfa-was-entered="sendRequestWithTfa"
        @clear-tfa-form="closeTfaForm"
      />
      <v-progress-linear
        :active="canShowProgressBar"
        :indeterminate="canShowProgressBar"
      />
    </template>
  </v-card>
</template>

<script lang="ts">
// TODO: Fix typescript for validators here
import { defineComponent, reactive } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import useVuelidate from '@vuelidate/core'

import {
  IAccountsActions,
  IAccountsGetters,
  IAccountsState,
} from '@/views/store/modules/accounts/types'
import { RequestStatus } from '@/types/network'
import { validateAccountFields } from '@/utils/validate'

import TfaModal from '../accounts/TfaModal.vue'

const {
  useGetters: useAccountsGetters,
  useActions: useAccountsActions,
} = createNamespacedHelpers<IAccountsState, IAccountsGetters, IAccountsActions>(
  'accounts'
)

export default defineComponent({
  components: { TfaModal },
  setup() {
    const authForm = reactive({
      login: '',
      pass: '',
    })

    const { sendAuthRequest } = useAccountsActions(['sendAuthRequest'])

    const {
      needTfa,
      requestStatus,
      closeTfaModal,
      hasSettedAccount,
      defaultAccount,
    } = useAccountsGetters([
      'needTfa',
      'requestStatus',
      'closeTfaModal',
      'hasSettedAccount',
      'defaultAccount',
    ])

    const validate = useVuelidate(
      // @ts-ignore
      validateAccountFields,
      { authForm },
      { $autoDirty: true }
    )

    return {
      authForm,
      validate,
      defaultAccount,
      sendAuthRequest,
      hasSettedAccount,
      closeTfaModal,
      needTfa,
      requestStatus,
    }
  },
  computed: {
    canShowProgressBar(): boolean {
      return this.requestStatus === RequestStatus.PENDING
    },
    loginError() {
      // @ts-ignore
      if (!this.validate.authForm.login.$dirty) {
        return
      }

      // @ts-ignore
      if (this.validate.authForm.login.minLength.$invalid) {
        return this.$tn('accounts.modal.authError.loginMinLength')
      }

      // @ts-ignore
      if (this.validate.authForm.login.required.$invalid) {
        return this.$tn('accounts.modal.authError.loginRequired')
      }

      return null
    },
    passwordError() {
      // @ts-ignore
      if (!this.validate.authForm.pass.$dirty) {
        return
      }

      // @ts-ignore
      if (this.validate.authForm.pass.minLength.$invalid) {
        return this.$tn('accounts.modal.authError.passMinLength')
      }

      // @ts-ignore
      if (this.validate.authForm.pass.required.$invalid) {
        return this.$tn('accounts.modal.authError.passRequired')
      }

      return null
    },
  },
  methods: {
    async sendRequest({ token }: { token?: string }) {
      await this.validate?.$touch()

      const hasFieldsFilled =
        this.authForm.login === '' && this.authForm.pass === ''

      if (hasFieldsFilled) {
        return
      }

      if (this.validate.authForm.$invalid) {
        return
      }

      await this.sendAuthRequest({
        username: this.authForm.login,
        password: this.authForm.pass,
        token,
        isReLogin: false,
      })

      if (this.canCloseModal) {
        this.hideModal()
      }
    },
    async sendRequestWithTfa(tfaToken: string) {
      await this.sendRequest({
        token: tfaToken,
      })
    },
    closeTfaForm() {
      this.closeTfaModal()
    },
  },
})
</script>

<style scoped>
.login-step {
  width: 415px;
}
</style>
