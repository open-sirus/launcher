<template>
  <progress-bar :progress="progress" :status="statusText" :title="title" />
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import ProgressBar from '@/views/components/common/ProgressBar.vue'
import { DownloadGameStatus } from '@/views/store/modules/downloadGame'
import type {
  IDownloadGameGetters,
  IDownloadGameState,
} from '@/views/store/modules/downloadGame'

const { useGetters: downloadGameGetters } = createNamespacedHelpers<
  IDownloadGameState,
  IDownloadGameGetters
>('downloadGame')

const i18nKeyByStatus = {
  [DownloadGameStatus.CHECKING]: 'checking',
  [DownloadGameStatus.IN_PROGRESS]: 'in_progress',
  [DownloadGameStatus.IDLE]: '',
  [DownloadGameStatus.FAILED]: '',
} as const

export default defineComponent({
  components: { ProgressBar },
  setup() {
    const { progress, speed, total, status, downloaded } = downloadGameGetters([
      'progress',
      'speed',
      'total',
      'downloaded',
      'status',
    ])

    return { progress, speed, total, status, downloaded }
  },
  computed: {
    showBlock() {
      return [
        DownloadGameStatus.CHECKING,
        DownloadGameStatus.IN_PROGRESS,
      ].includes(this.status as DownloadGameStatus)
    },
    statusText() {
      if (this.status === DownloadGameStatus.CHECKING) {
        return this.$tn('torrent.checked_count', {
          count: this.downloaded,
        })
      }

      return this.$tn('torrent.downloaded_count', {
        count: this.downloaded,
        speed: this.speed,
      })
    },
    title() {
      return this.$tn(
        `torrent.status.${i18nKeyByStatus[this.status as DownloadGameStatus]}`
      )
    },
  },
})
</script>
