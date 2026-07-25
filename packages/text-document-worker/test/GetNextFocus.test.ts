import { expect, test } from '@jest/globals'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as GetNextFocus from '../src/parts/GetNextFocus/GetNextFocus.ts'

test('ok', () => {
  const focusId = AboutFocusId.Ok
  expect(GetNextFocus.getNextFocus(focusId)).toBe(AboutFocusId.Copy)
})

test('copy', () => {
  const focusId = AboutFocusId.Copy
  expect(GetNextFocus.getNextFocus(focusId)).toBe(AboutFocusId.Ok)
})

test('other', () => {
  const focusId = AboutFocusId.None
  expect(GetNextFocus.getNextFocus(focusId)).toBe(AboutFocusId.None)
})
