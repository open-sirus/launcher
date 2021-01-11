import type { ActionContext, ActionTree } from 'vuex'

import { modulesFactory } from '@/utils/modulesFactory'
import { eventService } from '@/services/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'

import type { IRootState } from '../types'

export interface IDownloadGameState {}

const state: IDownloadGameState = {}

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
