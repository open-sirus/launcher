import type { ActionContext, ActionTree, GetterTree } from 'vuex'

import type { IRootState } from '@/views/store/types'
import type { NormalizedAdditional, NormalizedSchema } from '@/types/normalze'
import type { RequestStatus } from '@/types/network'

export interface IAuthResponse {
  tokenType: string
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenIsExpired: boolean
}

export interface ILoyaltyInfo {
  percent: number
  next: number
  current: number
  level: number
  nextLevel: number
}

export interface IShards {
  id: number
  shard: number
  mmotop: number
  total: number
  total2: number
  referrals: number
  updatedAt: Date
  loyaltyInfo: ILoyaltyInfo
}

export interface IPremium {
  id: number
  setdate: number
  unsetdate: number
  active: number
}

export interface IAccountAccess {
  id: number
  gmlevel: number
  realmID: number
  comment: string
}

export interface IAccountInfo {
  id: number
  username: string
  email: string
  joindate: Date
  lastIp: string
  failedLogins: number
  locked: number
  lastLogin: Date
  online: number
  mutetime: number
  mutereason: string
  locale: number
  timezoneBias?: Date
  os: string
  isSuspect: number
  createdAt: string
  updatedAt: Date
  fromAds: string
  gmRestrictExcluded: number
  regMail: string
  lastAttemptIp: string
  muteby: string
  passwordTime?: Date
  flags: number
  emailVerifiedAt?: Date
  hasTfa: boolean
  currentIp: string
  spentTime: number
  allowEmailChange: boolean
  bannedIp?: boolean
  banned?: boolean
  shards: IShards
  premium: IPremium
  accountAccess: IAccountAccess
}

export interface IAccount {
  id: number
  username: string
  password: string
  tfaToken?: string
  tokens: IAuthResponse
  tokenIsExpired: boolean
  accountInfo: IAccountInfo
}

export interface INormalizedAccount {
  id: number
  byId: IAccount
}

export interface IAdaptedResponse extends IAuthResponse {
  username: string
  password: string
  tfaToken?: string
}

export interface IValidationTimestamp {
  timestamp: number
  timestampWithDelayTime: number
  timezone: string
}

export interface INeedTfa {
  needTfa: boolean
  isReLogin: boolean
  username: string
  password: string
}

export interface IAccountsAdditional extends NormalizedAdditional {
  needTfa: INeedTfa
  lastValidationTimestamp: IValidationTimestamp
}

export interface IAccounts extends NormalizedSchema<IAccount> {
  data: {
    allIds: Array<number>
    byId: Record<number, IAccount>
    defaultId: number
  }
}

export interface IAccountsState {
  accounts: IAccounts
  additional: IAccountsAdditional
}

type ActionCtx = ActionContext<IAccountsState, IRootState>

export interface IAccountsActions
  extends ActionTree<IAccountsState, IRootState> {
  addAccount: (ctx: ActionCtx, payload: INormalizedAccount) => Promise<void>
  removeAccount: (ctx: ActionCtx, payload: number) => void
  setDefaultAccount: (ctx: ActionCtx, payload: IAccount) => void
  closeTfaModal: (ctx: ActionCtx) => void
  loadAccountInfo: (ctx: ActionCtx, payload: IAdaptedResponse) => Promise<void>
  sendAuthRequest: (
    ctx: ActionCtx,
    payload: {
      username: string
      password: string
      token?: string
      isReLogin?: boolean
    }
  ) => Promise<void>
  validateAccounts: (ctx: ActionCtx) => Promise<void>
  setValidationTimestamp: (ctx: ActionCtx) => void
  validateTimezone: (ctx: ActionCtx) => void
  validateAccount: (ctx: ActionCtx, payload: number) => Promise<void>
}

export interface IAccountsGetters
  extends GetterTree<IAccountsState, IRootState> {
  accounts: (state: IAccountsState) => Array<IAccount>
  defaultAccount: (state: IAccountsState) => IAccount
  hasSettedAccount: (
    state: IAccountsState,
    getters: IAccountsGetters
  ) => boolean
  needTfa: (
    state: IAccountsState
  ) => {
    needTfa: boolean
    isReLogin: boolean
    username: string
    password: string
  }
  requestStatus: (state: IAccountsState) => RequestStatus
}
