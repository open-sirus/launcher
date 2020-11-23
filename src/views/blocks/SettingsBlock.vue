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
        @click.native.prevent="choose"
        :value="clientDirectory"
        :label="$t('settings.choose_client_directory')"
        outlined
        readonly
        append-outer-icon="mdi-folder"
        @click:append-outer="choose"
        :error="!!errors.clientDirectory"
        :error-messages="errors.clientDirectory"
      >
      </v-text-field>
      <v-checkbox v-model="hasStartOnSystemStartup" dense class="mt-0">
        <template #label>
          {{ $t('settings.start_on_system_startup') }}
        </template>
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { createNamespacedHelpers } from 'vuex-composition-helpers'

import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import { IAppGetters, IAppState } from '@/store/modules/app'
import {
  ISettingsActions,
  ISettingsGetters,
  ISettingsState,
} from '@/store/modules/settings'

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

export interface ISettingsBlockState {
  errors: {
    clientDirectory: string | null
  }
}

export default defineComponent({
  data(): ISettingsBlockState {
    return {
      errors: {
        clientDirectory: null,
      },
    }
  },
  setup() {
    const { availableLocales } = useAppGetters(['availableLocales'])

    const {
      clientDirectory,
      locale,
      startOnSystemStartup,
    } = useSettingsGetters([
      'clientDirectory',
      'locale',
      'startOnSystemStartup',
    ])
    const { setLocale, setStartOnSystemStartup } = useSettingsActions([
      'setLocale',
      'setStartOnSystemStartup',
    ])

    return {
      setStartOnSystemStartup,
      startOnSystemStartup,
      availableLocales,
      clientDirectory,
      locale,
      setLocale,
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
  },
  methods: {
    handleChangeLocale(locale) {
      this.setLocale(locale)
    },
    async choose() {
      this.errors.clientDirectory = null

      eventService.emit(LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG)
      eventService.on(
        LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED,
        new CallbackListener<LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED>(
          () => {
            this.errors.clientDirectory = this.$t(
              'settings.errors.wrong_client_directory'
            ) as string
          },
          true
        )
      )
    },
  },
})
</script>
