import { expect, test } from '@jest/globals'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('returns patches for changed lines', () => {
  const oldState = {
    columnWidth: 9,
    diagnostics: [],
    findWidgetVisible: false,
    height: 200,
    languageId: 'plaintext',
    lineCount: 1,
    lineNumbers: true,
    lines: ['first line'],
    longestLineWidth: 90,
    maxLineY: 1,
    minLineY: 0,
    rowHeight: 20,
    scrollBarWidth: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [['first line', 'Token Text']],
    tokenizePath: '',
    uid: 42,
    uri: 'file:///test.txt',
    useCache: true,
    width: 100,
    x: 0,
    y: 0,
  }
  const newState = {
    ...oldState,
    lineCount: 2,
    lines: ['updated first line', 'second line'],
    maxLineY: 2,
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
