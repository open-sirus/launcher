import type { ActionContext, ActionTree, MutationTree } from 'vuex'

import { modulesFactory } from '@/utils/modulesFactory'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'
import { TORRENT_KEY, TORRENT_URL } from '@/constants'

import type { IRootState } from '../types'

enum DownloadGameStatus {
  IDLE = 'IDlE',
  STARTED = 'STARTED',
  ERRORED = 'ERRORED',
}

export interface IDownloadGameProgress {
  downloaded: number
  progress: number
  speed: number
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
  subscribeToTorrentEvents({ commit }) {
    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_STARTED,
      new CallbackListener(() => {
        commit('SET_STATUS', DownloadGameStatus.STARTED)
      })
    )
    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_PROGRESS,
      new CallbackListener((progress) => {
        commit('SET_PROGRESS', progress)
      })
    )
    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_ERROR,
      new CallbackListener(() => {
        commit('SET_STATUS', DownloadGameStatus.ERRORED)
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
  SET_PROGRESS(state, progress: IDownloadGameProgress) {
    state.progress = progress
  },
}

export const downloadGameModule = modulesFactory<
  IDownloadGameState,
  IRootState
>({
  state,
  actions,
  mutations,
})
