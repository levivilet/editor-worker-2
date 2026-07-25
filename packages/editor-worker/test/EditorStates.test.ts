import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('creates, isolates, and disposes editor states', () => {
  expect(EditorStates.create(1, 'file:///one.txt')).toEqual({
    content: '',
    diagnostics: [],
    languageId: 'plaintext',
    lines: [],
    tokenizedLines: [],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///one.txt',
  })
  expect(EditorStates.create(2, 'file:///two.ts', 'typescript', '/tokenize-typescript.js')).toEqual({
    content: '',
    diagnostics: [],
    languageId: 'typescript',
    lines: [],
    tokenizedLines: [],
    tokenizePath: '/tokenize-typescript.js',
    uid: 2,
    uri: 'file:///two.ts',
  })
  expect(EditorStates.get(1)).toMatchObject({ languageId: 'plaintext', uid: 1 })
  expect(EditorStates.get(2)).toMatchObject({ languageId: 'typescript', uid: 2 })

  EditorStates.set({
    content: 'one',
    diagnostics: [],
    languageId: 'plaintext',
    lines: ['one'],
    tokenizedLines: [['one', 'Token Text']],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///one.txt',
  })
  expect(EditorStates.get(1)).toMatchObject({ content: 'one', lines: ['one'], tokenizedLines: [['one', 'Token Text']], uid: 1 })
  expect(EditorStates.get(2)).toMatchObject({ lines: [], uid: 2 })

  expect(EditorStates.getRendered(1)).toBeUndefined()
  EditorStates.setRendered(EditorStates.get(1))
  expect(EditorStates.getRendered(1)).toMatchObject({
    content: 'one',
    languageId: 'plaintext',
    lines: ['one'],
    tokenizedLines: [['one', 'Token Text']],
    uid: 1,
    uri: 'file:///one.txt',
  })

  EditorStates.dispose(1)

  expect(() => EditorStates.get(1)).toThrow(new Error('Editor state not found: 1'))
  expect(EditorStates.getRendered(1)).toBeUndefined()
  expect(EditorStates.get(2)).toMatchObject({ languageId: 'typescript', lines: [], uid: 2, uri: 'file:///two.ts' })
  EditorStates.dispose(2)
})
