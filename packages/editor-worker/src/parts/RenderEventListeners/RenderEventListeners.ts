import type { DomEventListener } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenerFunctions.HandleBeforeInput,
      params: ['handleBeforeInput', 'event.inputType', 'event.data'],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleClick,
      params: ['handleClick', 'event.clientX', 'event.clientY', 'event.detail'],
    },
    {
      name: DomEventListenerFunctions.HandleInput,
      params: ['handleInput', 'event.target.value'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerDown,
      params: ['pointerDown', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerMove,
      params: ['pointerMove', 'event.clientX', 'event.clientY', 'event.buttons'],
    },
    {
      name: DomEventListenerFunctions.HandlePointerUp,
      params: ['pointerUp', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandleWheel,
      params: ['handleWheel', 'event.deltaMode', 'event.deltaX', 'event.deltaY'],
      preventDefault: true,
    },
  ]
}
