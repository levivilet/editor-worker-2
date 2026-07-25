import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEventListeners } from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('registers an editor click listener with pointer coordinates', () => {
  expect(renderEventListeners()).toEqual([
    {
      name: DomEventListenerFunctions.HandleClick,
      params: ['handleClick', 'event.clientX', 'event.clientY'],
    },
    {
      name: DomEventListenerFunctions.HandleInput,
      params: ['handleInput', 'event.target.value'],
    },
  ])
})
