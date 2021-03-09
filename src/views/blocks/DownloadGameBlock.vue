<template>
  <div v-if="showBlock" class="download-game-block">
    <progress-bar :progress="progress" :status="statusText" :title="title" />
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          @click="stopDownload"
          class="stop-download"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color="white">mdi-stop</v-icon>
        </v-btn>
      </template>
      <span> {{ $t('torrent.stop') }}</span>
    </v-tooltip>
  </div>
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

const {
  useGetters: downloadGameGetters,
  useActions: downloadGameActions,
} = createNamespacedHelpers<IDownloadGameState, IDownloadGameGetters>(
  'downloadGame'
)

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
    const { stopDownload } = downloadGameActions(['stopDownload'])

    return { progress, speed, total, status, downloaded, stopDownload }
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

<style scoped>
.download-game-block {
  display: flex;
  align-items: flex-end;
}

.progress-bar {
  padding-right: 0;
}

.stop-download {
  bottom: 10px;
}
</style>
