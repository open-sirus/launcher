import { EventBus } from '@/services/EventBus'
import { MainIpc } from '@/events/ipcs/MainIpc'

export const eventService = new EventBus(new MainIpc())
