<template>
  <progress-bar :progress="10" status="test" title="test" />
</template>

<script lang="ts">
import ProgressBar from '@/views/components/common/ProgressBar.vue'

export default {
  components: { ProgressBar },
}
</script>
