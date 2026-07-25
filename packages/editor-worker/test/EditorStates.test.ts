import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('creates, isolates, and disposes editor states', () => {
  const initialSelections = new Uint32Array([0, 0, 0, 0])
  const firstState = {
    columnWidth: 9,
    content: '',
    diagnostics: [],
    languageId: 'plaintext',
    lines: [],
    longestLineWidth: 0,
    scrollBarWidth: 0,
    selections: initialSelections,
    tokenizedLines: [],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///one.txt',
    width: 100,
  }
  const secondState = {
    ...firstState,
    languageId: 'typescript',
    tokenizePath: '/tokenize-typescript.js',
    uid: 2,
    uri: 'file:///two.ts',
    width: 200,
  }
  expect(EditorStates.create(1, 'file:///one.txt', 'plaintext', '', 100)).toEqual(firstState)
  expect(EditorStates.create(2, 'file:///two.ts', 'typescript', '/tokenize-typescript.js', 200)).toEqual(secondState)
  expect(EditorStates.get(1)).toEqual(firstState)
  expect(EditorStates.get(2)).toEqual(secondState)

  const changedFirstState = {
    ...firstState,
    content: 'one',
    lines: ['one'],
    tokenizedLines: [['one', 'Token Text']],
  }
  EditorStates.set(changedFirstState)
  expect(EditorStates.get(1)).toEqual(changedFirstState)
  expect(EditorStates.get(2)).toEqual(secondState)

  expect(EditorStates.getRendered(1)).toBeUndefined()
  EditorStates.setRendered(EditorStates.get(1))
  expect(EditorStates.getRendered(1)).toEqual(changedFirstState)

  EditorStates.dispose(1)

  expect(() => EditorStates.get(1)).toThrow(new Error('Editor state not found: 1'))
  expect(EditorStates.getRendered(1)).toBeUndefined()
  expect(EditorStates.get(2)).toEqual(secondState)
  EditorStates.dispose(2)
})
