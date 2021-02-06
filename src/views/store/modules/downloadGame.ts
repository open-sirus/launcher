import type { ActionContext, ActionTree } from 'vuex'

import { modulesFactory } from '@/utils/modulesFactory'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'

import type { IRootState } from '../types'

enum DownloadGameStatus {
  IDLE = 'IDlE',
  STARTED = 'STARTED',
  ERRORED = 'ERRORED',
}

export interface IDownloadGameState {
  status: DownloadGameStatus
  progress: number
}

const state: IDownloadGameState = {
  status: DownloadGameStatus.IDLE,
  progress: 0,
}

export interface IDownloadGameActions
  extends ActionTree<IDownloadGameState, IRootState> {
  startDownload: (
    ctx: ActionContext<IDownloadGameState, IRootState>
  ) => Promise<void>
  continueDownloadIfResumable: (
    ctx: ActionContext<IDownloadGameState, IRootState>
  ) => Promise<void>
  stopDownload: (
    ctx: ActionContext<IDownloadGameState, IRootState>
  ) => Promise<void>
}

const actions: IDownloadGameActions = {
  async startDownload() {
    eventService.emit(LauncherEvent.START_TORRENT, {
      torrentId: '',
      torrentUrl: '',
    })

    console.log('startDownloadGame')
  },
  async continueDownloadIfResumable() {
    console.log('continueDownloadGameIfResumable')
  },
  async stopDownload() {
    console.log('stopDownloadGame')
  },
}

export const downloadGameModule = modulesFactory<
  IDownloadGameState,
  IRootState
>({
  state,
  actions,
})
