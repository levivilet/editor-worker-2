import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('creates, isolates, and disposes editor states', () => {
  const initialSelections = new Uint32Array([0, 0, 0, 0])
  const firstState = {
    canRedo: false,
    canUndo: false,
    columnWidth: 9,
    diagnostics: [],
    findWidgetVisible: false,
    height: 200,
    languageId: 'plaintext',
    lineCount: 0,
    lineNumbers: true,
    lines: [],
    longestLineWidth: 0,
    maxLineY: 0,
    minLineY: 0,
    modified: false,
    rowHeight: 20,
    scrollBarWidth: 0,
    scrollLeft: 0,
    scrollTop: 0,
    selections: initialSelections,
    tokenizedLines: [],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///one.txt',
    useCache: true,
    version: 0,
    width: 100,
    x: 10,
    y: 20,
  }
  const secondState = {
    ...firstState,
    height: 400,
    languageId: 'typescript',
    tokenizePath: '/tokenize-typescript.js',
    uid: 2,
    uri: 'file:///two.ts',
    width: 300,
    x: 30,
    y: 40,
  }

  expect(EditorStates.create(1, 'file:///one.txt', 'plaintext', '', 10, 20, 100, 200)).toEqual(firstState)
  expect(EditorStates.create(2, 'file:///two.ts', 'typescript', '/tokenize-typescript.js', 30, 40, 300, 400)).toEqual(secondState)
  expect(EditorStates.get(1)).toEqual(firstState)
  expect(EditorStates.get(2)).toEqual(secondState)

  const changedFirstState = {
    ...firstState,
    lineCount: 1,
    lines: ['one'],
    maxLineY: 1,
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
