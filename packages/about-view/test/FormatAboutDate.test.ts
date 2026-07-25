import { expect, test } from '@jest/globals'
import * as FormatAboutDate from '../src/parts/FormatAboutDate/FormatAboutDate.ts'

const now = new Date('2024-01-01').getTime()

test('formatAboutDate - valid date', () => {
  const date = '2024-03-20'
  expect(FormatAboutDate.formatAboutDate(date, now)).toBe('2024-03-20 (in 2 months)')
})

test('formatAboutDate - invalid date', () => {
  const date = 'n/a'
  expect(FormatAboutDate.formatAboutDate(date, now)).toBe('Invalid Date: n/a')
})

test('formatAboutDate - empty date', () => {
  const date = ''
  expect(FormatAboutDate.formatAboutDate(date, now)).toBe('unknown')
})
