import { expect, test } from '@jest/globals'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as GetPreviousFocus from '../src/parts/GetPreviousFocus/GetPreviousFocus.ts'

test('ok', () => {
  const focusId = AboutFocusId.Ok
  expect(GetPreviousFocus.getPreviousFocus(focusId)).toBe(AboutFocusId.Copy)
})

test('copy', () => {
  const focusId = AboutFocusId.Copy
  expect(GetPreviousFocus.getPreviousFocus(focusId)).toBe(AboutFocusId.Ok)
})

test('other', () => {
  const focusId = AboutFocusId.None
  expect(GetPreviousFocus.getPreviousFocus(focusId)).toBe(AboutFocusId.None)
})
