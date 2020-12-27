import { MutationTree, ActionTree, GetterTree, ActionContext } from 'vuex'
import differentWith from 'lodash/differenceWith'

import { axios } from '@/modules/axios'
import { modulesFactory } from '@/utils/modulesFactory'
import { Langs } from '@/types/lang'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import LauncherFile from '@/entities/LauncherFile'
import { isPatchEqual } from '@/utils/patches'

import { IRootState } from '../types'

enum DownloadErrors {
  ALREADY_IN_PROGRESS = 'ALREADY_IN_PROGRESS',
}

export interface IFile {
  id?: number | string
  isDownloading?: boolean
  isIncomplete?: boolean
  path?: string
  md5?: string
  size?: number
  filename?: string
  host?: string
  storagePath?: string
  updatedAt?: string
  createdAt?: string
  new?: boolean // TODO: use isNew everywhere
  isNew?: boolean // TODO: use isNew everywhere
  status?: number // TODO: make enum
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
    const patches: Array<IFile> = data.patches.map(LauncherFile.fromObject)

    commit('SET_FILES_TO_REMOVE', data.delete)

    // Update file list and emit event only when they was really changed
    if (
      state.files &&
      patches.length === state.files.length &&
      // @ts-ignore
      differentWith(patches, state.files, isPatchEqual).length === 0
    ) {
      return
    }

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
