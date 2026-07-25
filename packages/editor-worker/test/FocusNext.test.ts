import { expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as FocusNext from '../src/parts/FocusNext/FocusNext.ts'

test('focusNext - from Ok to Copy', () => {
  const state: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusNext.focusNext(state)).toEqual({
    focusId: AboutFocusId.Copy,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  })
})

test('focusNext - from Copy to Ok', () => {
  const state: AboutState = {
    focusId: AboutFocusId.Copy,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusNext.focusNext(state)).toEqual({
    focusId: AboutFocusId.Ok,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  })
})

test('focusNext - from None stays None', () => {
  const state: AboutState = {
    focusId: AboutFocusId.None,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  }
  expect(FocusNext.focusNext(state)).toEqual({
    focusId: AboutFocusId.None,
    lines: [],
    productName: 'Test Product',
    uid: 1,
  })
})
