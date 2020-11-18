export interface IEventData {
  id: string
  isEnabled: boolean
  type: 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio'
  label: string
  click: () => void
}
