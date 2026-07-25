import { expect, test } from '@jest/globals'
import { getLines } from '../src/parts/GetLines/GetLines.ts'

test('splits common line endings and preserves empty lines', () => {
  expect(getLines('one\r\ntwo\n\nthree\rfour')).toEqual(['one', 'two', '', 'three', 'four'])
})

test('returns one line for empty content', () => {
  expect(getLines('')).toEqual([''])
})
