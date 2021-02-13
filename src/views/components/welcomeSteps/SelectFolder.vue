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
            {{ $t(errors.clientDirectory) }}
          </v-alert>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'

import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import type {
  IDownloadGameActions,
  IDownloadGameState,
} from '@/views/store/modules/downloadGame'
import type {
  ISettingsGetters,
  ISettingsState,
} from '@/views/store/modules/settings'
import type {
  IWelcomeActions,
  IWelcomeGetters,
  IWelcomeState,
} from '@/views/store/modules/welcome'

const { useActions: useDownloadGameActions } = createNamespacedHelpers<
  IDownloadGameState,
  Record<string, unknown>,
  IDownloadGameActions
>('downloadGame')

const { useGetters: useSettingsGetters } = createNamespacedHelpers<
  ISettingsState,
  ISettingsGetters
>('settings')

const { useActions: useWelcomeActions } = createNamespacedHelpers<
  IWelcomeState,
  IWelcomeGetters,
  IWelcomeActions
>('welcome')

export interface ISelectFolderError {
  clientDirectory: string | null
}

export default defineComponent({
  setup() {
    const errors = reactive<ISelectFolderError>({
      clientDirectory: null,
    })

    const { startDownload } = useDownloadGameActions(['startDownload'])
    const { clientDirectory } = useSettingsGetters(['clientDirectory'])
    const { nextStep } = useWelcomeActions([
      'nextStep',
      'prevStep',
      'setIsCompleted',
    ])

    eventService.on(
      LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED,
      new CallbackListener<LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED>(
        () => {
          nextStep()
        }
      )
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_STARTED,
      new CallbackListener<LauncherEvent.TORRENT_DOWNLOAD_STARTED>(() => {
        nextStep()
      })
    )

    eventService.on(
      LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED,
      new CallbackListener(() => {
        errors.clientDirectory = 'settings.errors.wrong_client_directory'
      }, true)
    )

    eventService.on(
      LauncherEvent.TORRENT_SELECT_FOLDER_ERROR,
      new CallbackListener(() => {
        errors.clientDirectory = 'settings.errors.wrong_client_directory'
      }, true)
    )

    const isButtonsDisabled = computed(() => Boolean(clientDirectory.value))

    return {
      startDownload,
      isButtonsDisabled,
    }
  },
  methods: {
    selectFolder() {
      eventService.emit(LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG)
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
