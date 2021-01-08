<template>
  <v-card class="client-update">
    <v-card-title>
      {{ $t('update.no-updates') }}
    </v-card-title>
    <v-card-text v-if="isValidationInProgress">
      <div class="mb-2">{{ $t('update.validation_in_progress') }}</div>
      <v-progress-linear
        :value="validationProgress.progress"
        color="success"
        height="25"
      >
        <template v-slot:default>
          <strong>{{ validationProgress.status }}</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
    <v-card-text v-else-if="isDownloadingInProgress">
      <div class="mb-2">{{ $t('update.downloading-in-progress') }}</div>
      <v-progress-linear
        :value="downloadProgress.progress"
        color="success"
        height="25"
      >
        <template v-slot:default>
          <strong>{{ downloadProgress.status }}</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="warning"
        @click="forceClientCheck"
        :disabled="isDownloadingInProgress || isValidationInProgress"
        >{{ $t('update.client.force-check') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { computed, defineComponent } from '@vue/composition-api'

import { NotificationTypes } from '@/types/notification'
import { ISettingsGetters } from '@/views/store/modules/settings'
import { INotificationActions } from '@/views/store/modules/notification'
import { IAppActions, IAppGetters } from '@/views/store/modules/app'
import { FileManageStatus } from '@/services/FileManageService'
const {
  useGetters: useSettingsGetters,
} = createNamespacedHelpers<ISettingsGetters>('settings')

const {
  useActions: useNotificationActions,
} = createNamespacedHelpers<INotificationActions>('notification')

const {
  useActions: useAppActions,
  useGetters: useAppGetters,
} = createNamespacedHelpers<IAppActions, IAppGetters>('app')

export default defineComponent({
  name: 'ClientUpdate',
  setup() {
    const { clientDirectory } = useSettingsGetters(['clientDirectory'])
    const { addNotification } = useNotificationActions(['addNotification'])
    const { loadFiles } = useAppActions(['loadFiles'])
    const { validationStatus } = useAppGetters(['validationStatus'])

    const isValidationInProgress = computed(
      () =>
        validationStatus.value &&
        validationStatus.value.status === FileManageStatus.VALIDATING
    )
    const isDownloadingInProgress = computed(
      () =>
        validationStatus.value &&
        validationStatus.value.status === FileManageStatus.DOWNLOADING
    )
    const validationProgress = computed(() => {
      const progress = {
        progress: 0,
        valid: 0,
        invalid: 0,
        status: '0/0',
      }

      if (!validationStatus.value) {
        return progress
      }

      const {
        filesCount,
        validatedCount,
        validCount,
      } = validationStatus.value.progress

      progress.progress = (validatedCount / filesCount) * 100
      progress.invalid =
        100 - ((filesCount - validCount) / (filesCount - validatedCount)) * 100
      progress.valid = 100 - progress.invalid - progress.progress
      progress.status = `${validatedCount}/${filesCount}`

      return progress
    })

    const downloadProgress = computed(() => {
      const progress = {
        progress: 0,
        status: 'update.calculating',
      }

      if (!validationStatus.value) {
        return progress
      }

      const { doneBytes, totalBytes } = validationStatus.value.progress

      if (totalBytes > 0) {
        progress.progress = doneBytes / totalBytes
        progress.status = `${doneBytes / 1024 / 1024}/${
          totalBytes / 1024 / 1024
        }`
      }

      return progress
    })

    const forceClientCheck = () => {
      if (!clientDirectory) {
        addNotification({
          type: NotificationTypes.ERROR,
          i18n: 'set_up_client_directory',
        })
      }

      loadFiles(true)
    }

    return {
      forceClientCheck,
      isValidationInProgress,
      isDownloadingInProgress,
      validationProgress,
      downloadProgress,
    }
  },
})
</script>
