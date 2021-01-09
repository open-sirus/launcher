import { object } from '@storybook/addon-knobs'

import AccountsModal from '@/views/components/accounts/AccountsModal.vue'
import TfaModal from '@/views/components/accounts/TfaModal.vue'

export default {
  title: 'AccountsModals',
}

export const AccountsModalView = () => ({
  components: { AccountsModal },
  template: '<accounts-modal />',
})

export const TfaModalView = () => ({
  components: { TfaModal },
  props: {
    hasTfa: {
      default: object('hasTfa', {
        needTfa: true,
        isReLogin: false,
        username: '',
        password: '',
      }),
    },
  },
  template: '<tfa-modal :hasTfa="hasTfa" />',
})
