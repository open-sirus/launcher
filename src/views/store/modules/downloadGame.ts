import type { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'

import { modulesFactory } from '@/utils/modulesFactory'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import { TORRENT_KEY, TORRENT_URL } from '@/constants'
import { NotificationTypes } from '@/types/notification'

import type { IRootState } from '../types'

export enum DownloadGameStatus {
  IDLE = 'IDlE',
  CHECKING = 'CHECKING',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
}

export interface IDownloadGameProgress {
  downloaded: number
  progress: number
  speed: number
  total: number
}

export interface IDownloadGameState {
  status: DownloadGameStatus
  progress: IDownloadGameProgress
}

const state: IDownloadGameState = {
  status: DownloadGameStatus.IDLE,
  progress: {
    downloaded: 0,
    progress: 0,
    speed: 0,
    total: 0,
  },
}

export interface IDownloadGameActions
  extends ActionTree<IDownloadGameState, IRootState> {
  subscribeToTorrentEvents: (
    ctx: ActionContext<IDownloadGameState, IRootState>
  ) => void
  startDownload: (ctx: ActionContext<IDownloadGameState, IRootState>) => void
  continueDownloadIfResumable: (
    ctx: ActionContext<IDownloadGameState, IRootState>
  ) => void
  stopDownload: (ctx: ActionContext<IDownloadGameState, IRootState>) => void
}

const actions: IDownloadGameActions = {
  subscribeToTorrentEvents({ commit, dispatch, rootGetters }) {
    eventService.on(
      LauncherEvent.TORRENT_SELECT_FOLDER_SUCCESS,
      new CallbackListener<LauncherEvent.TORRENT_SELECT_FOLDER_SUCCESS>(
        (_, { directory }) => {
          commit('settings/SET_CLIENT_DIRECTORY', directory, { root: true })
        }
      )
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_STARTED,
      new CallbackListener<LauncherEvent.TORRENT_DOWNLOAD_STARTED>(() => {
        commit('SET_STATUS', DownloadGameStatus.CHECKING)

        dispatch(
          'notification/addNotification',
          {
            type: NotificationTypes.INFO,
            i18n: 'download_game_started',
          },
          { root: true }
        )
      })
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_CHECKING,
      new CallbackListener<LauncherEvent.TORRENT_DOWNLOAD_CHECKING>(
        (_, { message }) => {
          commit('SET_STATUS', DownloadGameStatus.CHECKING)
          commit('SET_PROGRESS', message)
        }
      )
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_PROGRESS,
      new CallbackListener<LauncherEvent.TORRENT_DOWNLOAD_PROGRESS>(
        (_, { message }) => {
          commit('SET_STATUS', DownloadGameStatus.IN_PROGRESS)
          commit('SET_PROGRESS', message)
        }
      )
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_ERROR,
      new CallbackListener(() => {
        commit('SET_STATUS', DownloadGameStatus.FAILED)

        dispatch(
          'notification/addNotification',
          {
            type: NotificationTypes.ERROR,
            i18n: 'download_game_error',
          },
          { root: true }
        )
      })
    )
    eventService.on(
      LauncherEvent.SYSTEM_NOT_SUPPORTED_ERROR,
      new CallbackListener(() => {
        dispatch(
          'notification/addNotification',
          {
            type: NotificationTypes.ERROR,
            i18n: 'system_not_supported',
          },
          { root: true }
        )
      })
    )
  },
  startDownload() {
    eventService.emit(LauncherEvent.START_TORRENT, {
      torrentId: TORRENT_KEY,
      torrentUrl: TORRENT_URL,
    })
  },
  continueDownloadIfResumable() {
    eventService.emit(LauncherEvent.START_TORRENT, {
      torrentId: TORRENT_KEY,
      torrentUrl: TORRENT_URL,
    })
  },
  stopDownload() {
    eventService.emit(LauncherEvent.STOP_TORRENT)
  },
}

const mutations: MutationTree<IDownloadGameState> = {
  SET_STATUS(state, status: DownloadGameStatus) {
    state.status = status
  },
  SET_PROGRESS(state, progress) {
    state.progress = {
      downloaded: Math.round((progress.bytes_done / 1024 / 1024) * 100) / 100,
      progress: Math.round(progress.progress * 10000) / 100,
      speed: Math.round((progress.speed / 1024 / 1024) * 100) / 100,
      total: Math.round((progress.bytes / 1024 / 1024) * 100) / 100,
    }
  },
}

export interface IDownloadGameGetters
  extends GetterTree<IDownloadGameState, IRootState> {
  progress: (state: IDownloadGameState) => number
  speed: (state: IDownloadGameState) => number
  total: (state: IDownloadGameState) => number
  downloaded: (state: IDownloadGameState) => number
  status: (state: IDownloadGameState) => DownloadGameStatus
}

const getters: IDownloadGameGetters = {
  progress: (state) => state.progress.progress,
  speed: (state) => state.progress.speed,
  total: (state) => state.progress.total,
  downloaded: (state) => state.progress.downloaded,
  status: (state) => state.status,
}

export const downloadGameModule = modulesFactory<
  IDownloadGameState,
  IRootState
>({
  state,
  actions,
  mutations,
  getters,
})
