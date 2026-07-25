import { expect, test } from '@jest/globals'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('returns patches for changed lines', () => {
  const oldState = {
    lines: ['first line'],
    uid: 42,
    uri: 'file:///test.txt',
  }
  const newState = {
    ...oldState,
    lines: ['updated first line', 'second line'],
  }

  const result = renderIncremental(oldState, newState)

  expect(result[0]).toBe('Viewlet.setPatches')
  expect(result[1]).toBe(42)
  expect(result[2]).toEqual(expect.any(Array))
  expect(result[2]).not.toEqual([])
})
