import { MutationTree, ActionTree, GetterTree, ActionContext } from 'vuex'

import { axios } from '@/modules/axios'
import { modulesFactory } from '@/utils/modulesFactory'
import { Langs } from '@/types/lang'
import eventService from '@/services/EventService'
import LauncherEvent from '@/events/LauncherEvent'

import { IRootState } from '../types'

enum DownloadErrors {
  ALREADY_IN_PROGRESS = 'ALREADY_IN_PROGRESS',
}

interface IFile {
  isDownloading: boolean
  isIncomplete: boolean
  path: string
  md5: string
  size: number
  filename: string
  host: string
}

export interface IAvailableLocale {
  key: Langs
  lang: string
}

export interface IAppState {
  files?: Array<IFile>
  filesToRemove: Array<IFile>
  launcherFiles: Array<IFile>
  availableLocales: Array<IAvailableLocale>
  errors: DownloadErrors | null
}

const state: IAppState = {
  files: [],
  filesToRemove: [],
  launcherFiles: [],
  availableLocales: [
    { key: Langs.EN, lang: 'English' },
    { key: Langs.RU, lang: 'Русский' },
  ],
  errors: null,
}

const mutations: MutationTree<IAppState> = {
  SET_FILES(state, files) {
    state.files = files
  },
  SET_FILES_TO_REMOVE(state, files) {
    state.filesToRemove = files
  },
  SET_LAUNCHER_FILES(state, files) {
    state.launcherFiles = files
  },
  SET_INCOMPLETE_DOWNLOAD(state, file) {
    file.isDownloading = false
    file.isIncomplete = true
  },
  SET_ERROR(state, error) {
    state.errors = error
  },
}

export interface IAppActions extends ActionTree<IAppState, IRootState> {
  loadFiles: (ctx: ActionContext<IAppState, IRootState>) => Promise<void>
  initialStart: (ctx: ActionContext<IAppState, IRootState>) => Promise<void>
}

const actions: IAppActions = {
  async loadFiles({ commit, state }) {
    if (state.launcherFiles.find((f) => f.isDownloading)) {
      commit('SET_ERROR', DownloadErrors.ALREADY_IN_PROGRESS)
      return
    }

    const { data } = await axios.get('client/patches')

    commit('SET_FILES_TO_REMOVE', data.delete)

    if (state.files && data.patches.length === state.files.length) {
      const original = state.files.map((p) =>
        [p.path, p.filename, p.host, p.md5, p.size].join('#')
      )
      const updated = data.patches.map((p) =>
        [p.path, p.filename, p.host, p.md5, p.size].join('#')
      )
      const merged = updated.filter((u) => original.includes(u))

      if (merged.length === updated.length) {
        return
      }
    }
    // Update file list and emit event only when they was really changed
    eventService.emit(LauncherEvent.FILE_LIST_UPDATED, data.patches)
    commit('SET_FILES', data.patches)
  },
  async initialStart({ state, commit }) {
    state.launcherFiles.forEach((file) => {
      if (file.isDownloading) {
        commit('SET_INCOMPLETE_DOWNLOAD', file)
      }
    })
  },
}

export interface IAppGetters extends GetterTree<IAppState, IRootState> {
  availableLocales: (state: IAppState) => Array<IAvailableLocale>
}

const getters: IAppGetters = {
  availableLocales: (state) => state.availableLocales,
}

export const appModule = modulesFactory<IAppState, IRootState>({
  state,
  mutations,
  actions,
  getters,
})
