<template>
  <v-row align="center" dense>
    <v-col cols="auto" class="pt-0 pb-0">
      <span>Sirus.su</span>
      <span>(ver. {{ version }})</span>
    </v-col>
    <v-col v-for="realm in mappedRealms" :key="realm.id" cols="auto">
      {{ realm.name }}
      <v-icon :color="realm.color" class="mr-0" size="22">
        {{ mdiCircle }}
      </v-icon>
    </v-col>
    <v-col class="online" cols="auto">
      {{ $tc('statusBar.online', online) }}
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { mdiCircle } from '@mdi/js'

import { IRealm } from '@/views/store/modules/statusBar/types'

export default defineComponent({
  name: 'StatusBar',
  props: {
    realms: {
      type: Array,
      required: true,
    },
    online: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      mdiCircle,
    }
  },
  computed: {
    version() {
      return `0.0.0` // TODO: need fix this.$interop.getAppVersion()
    },
    mappedRealms(): Array<IRealm> {
      // @ts-ignore
      return this.realms.map((realm: IRealm) => {
        return {
          id: realm.id,
          online: realm.online,
          name: realm.name.split(' -')[0],
          color: realm.isOnline ? 'green' : 'red',
        }
      })
    },
  },
})
</script>
