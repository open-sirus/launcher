<template>
  <v-row class="select-folder">
    <v-col>
      <v-row>
        <v-col align-self="center">
          <v-btn @click="selectFolder">
            {{ $t('steps.select_folder.select_existed') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-spacer />
      <v-row>
        <v-col align-self="center">
          <v-btn @click="downloadGame">
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
import { defineComponent } from '@vue/composition-api'

import eventService from '@/services/EventService'
import LauncherEvent from '@/events/LauncherEvent'
import CallbackListener from '@/events/CallbackListener'

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
  methods: {
    selectFolder() {
      this.errors.clientDirectory = null

      eventService.emit(LauncherEvent.OPEN_SELECT_GAME_DIRECTORY_DIALOG, {})
      eventService.on(
        LauncherEvent.WRONG_GAME_DIRECTORY_SELECTED,
        new CallbackListener(() => {
          this.errors.clientDirectory = this.$t(
            'settings.errors.wrong_client_directory'
          ) as string
        }, true)
      )
    },
    downloadGame() {
      // TODO: implement after add download game logic
      console.log('downloadGame')
    },
  },
})
</script>

<style scoped>
.select-folder {
  width: 400px;
}
</style>
