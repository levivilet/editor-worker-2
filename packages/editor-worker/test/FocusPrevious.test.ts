import { expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as FocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'

test('focusPrevious - from Ok to Copy', () => {
  const state: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusPrevious.focusPrevious(state)).toEqual({
    focusId: AboutFocusId.Copy,
    lines: [],
    productName: 'Test Product',

    uid: 1,
  })
})

test('focusPrevious - from Copy to Ok', () => {
  const state: AboutState = {
    focusId: AboutFocusId.Copy,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusPrevious.focusPrevious(state)).toEqual({
    focusId: AboutFocusId.Ok,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  })
})

test('focusPrevious - from None stays None', () => {
  const state: AboutState = {
    focusId: AboutFocusId.None,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusPrevious.focusPrevious(state)).toEqual({
    focusId: AboutFocusId.None,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  })
})
