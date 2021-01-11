/* eslint-disable @typescript-eslint/naming-convention */
import type _Vue from 'vue'

import type { ElectronInterop } from '@/utils/electronInterop'
import { interop } from '@/utils/electronInterop'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function Interop(Vue: typeof _Vue): void {
  Vue.prototype.$interop = interop
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Vue {
    $interop: ElectronInterop
  }
}
