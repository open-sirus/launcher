import { MutationTree, ActionTree, ActionContext, GetterTree } from 'vuex'

import { isCorrectClientDirectory } from '@/utils/files'
import { modulesFactory } from '@/utils/modulesFactory'
import { Langs } from '@/types/lang'
import { i18n as i18nModule } from '@/modules/i18n'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'

import { IRootState } from '../types'

export interface ISettingsState {
  clientDirectory: string | null
  startOnSystemStartup: boolean
  startInMinimizedMode: boolean
  ignoreFileHashCheck: boolean
  locale: Langs
  isFirstStart: boolean
}

const state: ISettingsState = {
  clientDirectory: null,
  startOnSystemStartup: true,
  startInMinimizedMode: true,
  ignoreFileHashCheck: false,
  locale: Langs.RU,
  isFirstStart: true,
}

const mutations: MutationTree<ISettingsState> = {
  SET_CLIENT_DIRECTORY(state, directory) {
    state.clientDirectory = directory
  },
  IGNORE_FILE_HASH_CHECK(state, ignore) {
    state.ignoreFileHashCheck = ignore
  },
  SET_START_ON_SYSTEM_STARTUP(state, start) {
    state.startOnSystemStartup = start
  },
  SET_START_IN_MINIMIZED_MODE(state, mode) {
    state.startInMinimizedMode = mode
  },
  SET_LOCALE(state, locale: Langs) {
    state.locale = locale
  },
  SET_IS_FIRST_START(state) {
    state.isFirstStart = false
  },
}

type ActionCtx = ActionContext<ISettingsState, IRootState>

export interface ISettingsActions
  extends ActionTree<ISettingsState, IRootState> {
  setClientDirectory: (ctx: ActionCtx, directory: string) => Promise<void>
  setLocale: (ctx: ActionCtx, lang: Langs) => void
  setStartOnSystemStartup: (ctx: ActionCtx, payload: boolean) => void
  setStartInMinimizedMode: (ctx: ActionCtx, payload: boolean) => void
  setIsFirstStart: (ctx: ActionCtx) => void
}

const actions: ISettingsActions = {
  async setClientDirectory({ commit }, directory: string) {
    if (await isCorrectClientDirectory(directory)) {
      commit('SET_CLIENT_DIRECTORY', directory)
    }
  },
  setLocale({ commit }, lang: Langs) {
    commit('SET_LOCALE', lang)
    i18nModule.locale = lang
  },
  setStartOnSystemStartup({ commit }, payload) {
    commit('SET_START_ON_SYSTEM_STARTUP', payload)
    commit('SET_START_IN_MINIMIZED_MODE', payload)
    eventService.emit(LauncherEvent.SET_START_ON_SYSTEM_STARTUP, {
      isStartOnSystemStartup: payload,
      isStartInMinimizedMode: payload,
    })
  },
  setStartInMinimizedMode({ commit }, payload) {
    commit('SET_START_IN_MINIMIZED_MODE', payload)
    eventService.emit(LauncherEvent.SET_START_IN_MINIMIZED_MODE, {
      isStartOnSystemStartup: true,
      isStartInMinimizedMode: payload,
    })
  },
  setIsFirstStart({ commit }) {
    commit('SET_IS_FIRST_START')
    eventService.emit(LauncherEvent.SET_START_ON_SYSTEM_STARTUP, {
      isStartOnSystemStartup: true,
      isStartInMinimizedMode: true,
    })
  },
}

export interface ISettingsGetters
  extends GetterTree<ISettingsState, IRootState> {
  clientDirectory: (state: ISettingsState) => string | null
  locale: (state: ISettingsState) => Langs
  startOnSystemStartup: (state: ISettingsState) => boolean
  startInMinimizedMode: (state: ISettingsState) => boolean
}

const getters: ISettingsGetters = {
  clientDirectory: (state) => state.clientDirectory,
  locale: (state) => state.locale,
  startOnSystemStartup: (state) => state.startOnSystemStartup,
  startInMinimizedMode: (state) => state.startInMinimizedMode,
}

export const settingsModule = modulesFactory<ISettingsState, IRootState>({
  state,
  mutations,
  actions,
  getters,
})
