<template>
  <v-row class="select-folder">
    <v-col>
      <v-row>
        <v-col align-self="center">
          <v-btn @click="selectFolder" :disabled="isButtonsDisabled">
            {{ $t('steps.select_folder.select_existed') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-spacer />
      <v-row>
        <v-col align-self="center">
          <v-btn @click="downloadGame" :disabled="isButtonsDisabled">
            {{ $t('steps.select_folder.download') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-spacer />
      <v-row v-if="errors.clientDirectory">
        <v-col align-self="center">
          <v-alert border="top" color="red lighten-2" dark>
            {{ errors.clientDirectory }}
          </v-alert>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'

import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import {
  IDownloadGameActions,
  IDownloadGameState,
} from '@/views/store/modules/downloadGame'
import {
  ISettingsGetters,
  ISettingsState,
} from '@/views/store/modules/settings'

const { useActions: useDownloadGameActions } = createNamespacedHelpers<
  IDownloadGameState,
  Record<string, unknown>,
  IDownloadGameActions
>('downloadGame')

const { useGetters: useSettingsGetters } = createNamespacedHelpers<
  ISettingsState,
  ISettingsGetters
>('settings')

export interface ISelectFolderState {
  errors: {
    clientDirectory: string | null
  }
}

export default defineComponent({
  data(): ISelectFolderState {
    return {
      errors: {
        clientDirectory: null,
      },
    }
  },
  setup() {
    const { startDownload } = useDownloadGameActions(['startDownload'])
    const { clientDirectory } = useSettingsGetters(['clientDirectory'])

    const isButtonsDisabled = computed(() => Boolean(clientDirectory.value))

    return {
      startDownload,
      isButtonsDisabled,
    }
  },
  methods: {
    selectFolder() {
      this.errors.clientDirectory = null

      eventService.emit(LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG)
      eventService.on(
        LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED,
        new CallbackListener(() => {
          this.errors.clientDirectory = this.$tn(
            'settings.errors.wrong_client_directory'
          )
        }, true)
      )
    },
    downloadGame() {
      this.startDownload()
    },
  },
})
</script>

<style scoped>
.select-folder {
  width: 400px;
}
</style>
