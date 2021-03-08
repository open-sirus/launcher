<template>
  <v-card>
    <v-card-title>
      {{ $t('sidebar.settings') }}
    </v-card-title>
    <v-card-text>
      <v-select
        item-text="lang"
        item-value="key"
        :value="locale"
        :items="availableLocales"
        :label="$t('settings.choose_lang')"
        @change="handleChangeLocale"
        outlined
      ></v-select>
      <v-text-field
        outlined
        readonly
        @click.native.prevent="chooseFolder"
        :value="clientDirectory"
        :label="$t('settings.choose_client_directory')"
        :error="!!errors.clientDirectory"
        :error-messages="$t(errors.clientDirectory)"
      >
        <template #append-outer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="chooseFolder" icon v-bind="attrs" v-on="on">
                <v-icon color="white" class="mr-0" size="22">
                  {{ mdiFolder }}
                </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('settings.folder.existed') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="downloadNewGame" icon v-bind="attrs" v-on="on">
                <v-icon color="white" class="mr-0" size="22">
                  {{ mdiDownload }}
                </v-icon>
              </v-btn>
            </template>
            <span> {{ $t('settings.folder.new') }}</span>
          </v-tooltip>
        </template>
      </v-text-field>
      <v-checkbox v-model="hasStartOnSystemStartup" dense class="mt-0">
        <template #label>
          {{ $t('settings.start_on_system_startup') }}
        </template>
      </v-checkbox>
      <v-checkbox
        v-if="hasStartOnSystemStartup"
        v-model="hasStartInMinimizedMode"
        dense
        class="mt-0"
      >
        <template #label>
          {{ $t('settings.start_in_minimized_mode') }}
        </template>
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { mdiFolder, mdiDownload } from '@mdi/js'
import { defineComponent, reactive } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'

import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import type { IAppGetters, IAppState } from '@/views/store/modules/app'
import type {
  ISettingsActions,
  ISettingsGetters,
  ISettingsState,
} from '@/views/store/modules/settings'
import type {
  IDownloadGameActions,
  IDownloadGameState,
} from '@/views/store/modules/downloadGame'
import type { Langs } from '@/types/lang'

const { useGetters: useAppGetters } = createNamespacedHelpers<
  IAppState,
  IAppGetters
>('app')

const {
  useGetters: useSettingsGetters,
  useActions: useSettingsActions,
} = createNamespacedHelpers<ISettingsState, ISettingsGetters, ISettingsActions>(
  'settings'
)

const { useActions: useDownloadGameActions } = createNamespacedHelpers<
  IDownloadGameState,
  Record<string, unknown>,
  IDownloadGameActions
>('downloadGame')

export interface ISettingsBlockErrors {
  clientDirectory: string | null
}

export default defineComponent({
  setup() {
    const errors = reactive<ISettingsBlockErrors>({
      clientDirectory: null,
    })

    const { availableLocales } = useAppGetters(['availableLocales'])

    const {
      clientDirectory,
      locale,
      startOnSystemStartup,
      startInMinimizedMode,
    } = useSettingsGetters([
      'clientDirectory',
      'locale',
      'startOnSystemStartup',
      'startInMinimizedMode',
    ])
    const {
      setLocale,
      setStartOnSystemStartup,
      setStartInMinimizedMode,
    } = useSettingsActions([
      'setLocale',
      'setStartOnSystemStartup',
      'setStartInMinimizedMode',
    ])
    const { startDownload } = useDownloadGameActions(['startDownload'])

    eventService.on(
      LauncherEvent.TORRENT_SELECT_FOLDER_ERROR,
      new CallbackListener(() => {
        errors.clientDirectory = 'settings.errors.wrong_client_directory'
      })
    )
    eventService.on(
      LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED,
      new CallbackListener(() => {
        errors.clientDirectory = 'settings.errors.wrong_client_directory'
      })
    )

    return {
      setStartInMinimizedMode,
      startInMinimizedMode,
      setStartOnSystemStartup,
      startOnSystemStartup,
      availableLocales,
      clientDirectory,
      locale,
      setLocale,
      mdiFolder,
      mdiDownload,
      startDownload,
      errors,
    }
  },
  computed: {
    hasStartOnSystemStartup: {
      get() {
        return this.startOnSystemStartup
      },
      set(val) {
        this.setStartOnSystemStartup(val)
      },
    },
    hasStartInMinimizedMode: {
      get() {
        return this.startInMinimizedMode
      },
      set(val) {
        console.log(val)
        this.setStartInMinimizedMode(val)
      },
    },
  },
  methods: {
    handleChangeLocale(locale: Langs) {
      this.setLocale(locale)
    },
    chooseFolder() {
      this.errors.clientDirectory = null

      eventService.emit(LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG)
    },
    downloadNewGame() {
      this.errors.clientDirectory = null

      this.startDownload()
    },
  },
})
</script>
