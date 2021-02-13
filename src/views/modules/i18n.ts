import _Vue from 'vue'
import VueI18n from 'vue-i18n'

import type { I18nValue, Path } from '@/types/i18n'

import { en } from '../locales/en'
import { ru } from '../locales/ru'

_Vue.use(VueI18n)

type Locales = typeof en | typeof ru

const pluralizationRules = {
  ru: (choice: number) => {
    if (choice === 0) {
      return 0
    }

    let form

    if (choice % 10 === 1 && choice % 100 !== 11) {
      form = 0
    } else if (
      choice % 10 >= 2 &&
      choice % 10 <= 4 &&
      (choice % 100 < 10 || choice % 100 >= 20)
    ) {
      form = 1
    } else {
      form = 2
    }

    return form
  },
}

export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  messages: {
    en,
    ru,
  },
  pluralizationRules,
})

type InfPath<P> = P extends Path<Locales> ? I18nValue<Locales, P> : string

export function $i18n<P extends string>(
  path: P extends Path<Locales> ? P : string,
  values?: VueI18n.Values
): InfPath<P> {
  return i18n.t(path, values) as InfPath<P>
}

export const initI18n = () => {
  _Vue.prototype.$tn = $i18n
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  interface Vue {
    $tn: typeof $i18n
  }
}
