import { expect, test } from '@jest/globals'
import { getWordSelection } from '../src/parts/GetWordSelection/GetWordSelection.ts'

test('selects the word around the cursor', () => {
  expect(getWordSelection('first second', 3, 8)).toEqual(new Uint32Array([3, 6, 3, 12]))
})

test('selects a word at the end of a line', () => {
  expect(getWordSelection('first second', 0, 12)).toEqual(new Uint32Array([0, 6, 0, 12]))
})

test('supports unicode word characters', () => {
  expect(getWordSelection('die füße', 1, 6)).toEqual(new Uint32Array([1, 4, 1, 8]))
})

test('keeps punctuation and whitespace selections collapsed', () => {
  expect(getWordSelection('first . second', 0, 7)).toEqual(new Uint32Array([0, 7, 0, 7]))
})
