import { expect, test } from '@jest/globals'
import { getScrollBarWidth } from '../src/parts/GetScrollBarWidth/GetScrollBarWidth.ts'

test('returns zero when the viewport width is unknown', () => {
  expect(getScrollBarWidth(0, 100)).toBe(0)
})

test('returns zero when the content fits', () => {
  expect(getScrollBarWidth(100, 100)).toBe(0)
})

test('returns a proportional scrollbar width for overflowing content', () => {
  expect(getScrollBarWidth(100, 200)).toBe(50)
})

test('uses the minimum scrollbar width for very wide content', () => {
  expect(getScrollBarWidth(100, 1000)).toBe(20)
})
