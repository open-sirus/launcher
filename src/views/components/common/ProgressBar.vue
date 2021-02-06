<template>
  <v-card-text class="progress-bar">
    <div class="mb-2">{{ title }}</div>
    <v-progress-linear :value="progress" color="success" height="25">
      <template v-slot:default>
        <strong>{{ status }}</strong>
      </template>
    </v-progress-linear>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export interface IProgressBarProps {
  progress: number
  status: string
  title: string
}

export default defineComponent<IProgressBarProps>({
  props: {
    progress: {
      type: Number,
    },
    status: {
      type: String,
    },
    title: {
      type: String,
    },
  },
})
</script>

<style scoped>
.progress-bar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
</style>
