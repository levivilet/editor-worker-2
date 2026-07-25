type FindWidgetStatus = 'opening' | 'visible'

export interface FindWidgetHandle {
  readonly instanceId: string
  readonly intentSequence: number
  readonly kind: 'find'
  readonly status: FindWidgetStatus
}
