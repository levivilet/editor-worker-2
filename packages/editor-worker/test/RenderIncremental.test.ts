import { expect, test } from '@jest/globals'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('returns patches for changed lines', () => {
  const oldState = {
    columnWidth: 9,
    content: 'first line',
    diagnostics: [],
    languageId: 'plaintext',
    lines: ['first line'],
    longestLineWidth: 90,
    scrollBarWidth: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [['first line', 'Token Text']],
    tokenizePath: '',
    uid: 42,
    uri: 'file:///test.txt',
    width: 100,
  }
  const newState = {
    ...oldState,
    content: 'updated first line\nsecond line',
    lines: ['updated first line', 'second line'],
    tokenizedLines: [
      ['updated first line', 'Token Text'],
      ['second line', 'Token Text'],
    ],
  }

  const result = renderIncremental(oldState, newState)

  expect(result[0]).toBe('Viewlet.setPatches')
  expect(result[1]).toBe(42)
  expect(result[2]).toEqual(expect.any(Array))
  expect(result[2]).not.toEqual([])
})
