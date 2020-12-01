import { EventBus } from '@/services/EventBus'
import { RenderedIpc } from '@/events/ipcs/RenderedIpc'

export const eventService = new EventBus(new RenderedIpc())
