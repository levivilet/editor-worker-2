import { expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import { renderFocusContext } from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('renderFocusContext returns correct array', () => {
  const oldState: AboutState = {
    focusId: 0,
    lines: [],
    productName: 'test',
    uid: 0,
  }
  const newState: AboutState = {
    focusId: 0,
    lines: [],
    productName: 'test',
    uid: 42,
  }

  const result = renderFocusContext(oldState, newState)

  expect(result).toEqual(['Viewlet.setFocusContext', 42, WhenExpression.FocusAbout])
})
