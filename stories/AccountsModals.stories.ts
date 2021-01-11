import { object, boolean } from '@storybook/addon-knobs'

import AccountsModal from '@/views/components/accounts/AccountsModal.vue'
import TfaModal from '@/views/components/accounts/TfaModal.vue'
import type { INeedTfa } from '@/views/store/modules/accounts/types'

export default {
  title: 'AccountsModals',
}

export const AccountsModalView = () => ({
  components: { AccountsModal },
  props: {
    canShowProgressBar: {
      default: boolean('canShowProgressBar', false),
    },
    canShowModal: {
      default: boolean('canShowModal', false),
    },
  },
  template:
    '<accounts-modal :can-show-progress-bar="canShowProgressBar" :can-show-modal="canShowModal" />',
})

export const TfaModalView = () => ({
  components: { TfaModal },
  props: {
    canShowProgressBar: {
      default: boolean('canShowProgressBar', false),
    },
    tfa: {
      default: object<INeedTfa>('tfa', {
        needTfa: true,
        isReLogin: false,
        username: '',
        password: '',
      }),
    },
  },
  template:
    '<tfa-modal :tfa="tfa" :can-show-progress-bar="canShowProgressBar" />',
})
