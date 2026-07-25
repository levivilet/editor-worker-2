import { expect, test } from '@jest/globals'
import { getLongestLineWidth } from '../src/parts/GetLongestLineWidth/GetLongestLineWidth.ts'

test('returns zero for no lines', () => {
  expect(getLongestLineWidth([], 9)).toBe(0)
})

test('returns the width of the longest line', () => {
  expect(getLongestLineWidth(['short', 'longer line', 'tiny'], 9)).toBe(99)
})
