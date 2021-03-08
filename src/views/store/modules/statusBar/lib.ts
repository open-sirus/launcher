import type { IRealm } from '@/views/store/modules/statusBar/types'

export const getSummaryOnline = (realms: Array<IRealm>): number => {
  return realms
    ? realms.reduce((online, element) => online + element.online, 0)
    : 0
}
