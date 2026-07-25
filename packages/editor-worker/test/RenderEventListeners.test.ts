import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEventListeners } from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('registers an editor click listener with pointer coordinates and click count', () => {
  expect(renderEventListeners()).toEqual([
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
  ])
})
