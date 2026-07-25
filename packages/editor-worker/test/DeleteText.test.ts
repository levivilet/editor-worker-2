import { expect, test } from '@jest/globals'
import { deleteCharacterLeft } from '../src/parts/DeleteCharacterLeft/DeleteCharacterLeft.ts'
import { deleteCharacterRight } from '../src/parts/DeleteCharacterRight/DeleteCharacterRight.ts'
import { deleteWordLeft } from '../src/parts/DeleteWordLeft/DeleteWordLeft.ts'
import { deleteWordRight } from '../src/parts/DeleteWordRight/DeleteWordRight.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { setSelections2 } from '../src/parts/SetSelections2/SetSelections2.ts'

/* eslint-disable jest/expect-expect */

const createEditor = (editorUid: number, lines: readonly string[], selections: Uint32Array): number => {
  const state = EditorStates.create(editorUid)
  EditorStates.set({
    ...state,
    content: lines.join('\n'),
    lines,
  })
  setSelections2(editorUid, selections)
  return editorUid
}

const expectEditor = (editorUid: number, lines: readonly string[], selections: readonly number[]): void => {
  const { content, lines: actualLines, selections: actualSelections, tokenizedLines } = EditorStates.get(editorUid)
  expect(content).toBe(lines.join('\n'))
  expect(actualLines).toEqual(lines)
  expect(actualSelections).toEqual(new Uint32Array(selections))
  expect(tokenizedLines).toEqual(lines.map((line) => [line, 'Token Text']))
  EditorStates.dispose(editorUid)
}

test('deletes a character left', async () => {
  const editorUid = createEditor(100, ['abc'], new Uint32Array([0, 3, 0, 3]))

  await deleteCharacterLeft(editorUid)

  expectEditor(editorUid, ['ab'], [0, 2, 0, 2])
})

test('deletes one Unicode grapheme left', async () => {
  const editorUid = createEditor(101, ['a👮🏽‍♀️b'], new Uint32Array([0, 8, 0, 8]))

  await deleteCharacterLeft(editorUid)

  expectEditor(editorUid, ['ab'], [0, 1, 0, 1])
})

test('deletes a character right', async () => {
  const editorUid = createEditor(102, ['abc'], new Uint32Array([0, 1, 0, 1]))

  await deleteCharacterRight(editorUid)

  expectEditor(editorUid, ['ac'], [0, 1, 0, 1])
})

test('deletes one Unicode grapheme right', async () => {
  const editorUid = createEditor(103, ['a👮🏽‍♀️b'], new Uint32Array([0, 1, 0, 1]))

  await deleteCharacterRight(editorUid)

  expectEditor(editorUid, ['ab'], [0, 1, 0, 1])
})

test('joins lines when deleting left at a line boundary', async () => {
  const editorUid = createEditor(104, ['one ', 'two'], new Uint32Array([1, 0, 1, 0]))

  await deleteCharacterLeft(editorUid)

  expectEditor(editorUid, ['one two'], [0, 4, 0, 4])
})

test('joins lines when deleting right at a line boundary', async () => {
  const editorUid = createEditor(105, ['one ', 'two'], new Uint32Array([0, 4, 0, 4]))

  await deleteCharacterRight(editorUid)

  expectEditor(editorUid, ['one two'], [0, 4, 0, 4])
})

test('deletes a selection for either character direction', async () => {
  const leftEditorUid = createEditor(106, ['alpha beta'], new Uint32Array([0, 2, 0, 8]))
  const rightEditorUid = createEditor(107, ['alpha beta'], new Uint32Array([0, 8, 0, 2]))

  await deleteCharacterLeft(leftEditorUid)
  await deleteCharacterRight(rightEditorUid)

  expectEditor(leftEditorUid, ['alta'], [0, 2, 0, 2])
  expectEditor(rightEditorUid, ['alta'], [0, 2, 0, 2])
})

test('deletes a word left', async () => {
  const editorUid = createEditor(108, ['foo bar'], new Uint32Array([0, 7, 0, 7]))

  await deleteWordLeft(editorUid)

  expectEditor(editorUid, ['foo '], [0, 4, 0, 4])
})

test('deletes a word and trailing space left', async () => {
  const editorUid = createEditor(114, ['foo bar'], new Uint32Array([0, 4, 0, 4]))

  await deleteWordLeft(editorUid)

  expectEditor(editorUid, ['bar'], [0, 0, 0, 0])
})

test('deletes a word right', async () => {
  const editorUid = createEditor(115, ['foo bar'], new Uint32Array([0, 0, 0, 0]))

  await deleteWordRight(editorUid)

  expectEditor(editorUid, [' bar'], [0, 0, 0, 0])
})

test('deletes a word and leading space right', async () => {
  const editorUid = createEditor(109, ['foo bar'], new Uint32Array([0, 3, 0, 3]))

  await deleteWordRight(editorUid)

  expectEditor(editorUid, ['foo'], [0, 3, 0, 3])
})

test('does nothing at the outer document boundaries', async () => {
  const leftEditorUid = createEditor(110, ['abc'], new Uint32Array([0, 0, 0, 0]))
  const rightEditorUid = createEditor(111, ['abc'], new Uint32Array([0, 3, 0, 3]))

  await deleteCharacterLeft(leftEditorUid)
  await deleteWordRight(rightEditorUid)

  expectEditor(leftEditorUid, ['abc'], [0, 0, 0, 0])
  expectEditor(rightEditorUid, ['abc'], [0, 3, 0, 3])
})

test('updates multiple cursors against the same document version', async () => {
  const editorUid = createEditor(112, ['abc def'], new Uint32Array([0, 3, 0, 3, 0, 7, 0, 7]))

  await deleteCharacterLeft(editorUid)

  expectEditor(editorUid, ['ab de'], [0, 2, 0, 2, 0, 5, 0, 5])
})

test('validates and copies selections', () => {
  const { uid: editorUid } = EditorStates.create(113)
  const selections = new Uint32Array([0, 1, 0, 1])

  setSelections2(editorUid, selections)
  selections[1] = 2

  const { selections: actualSelections } = EditorStates.get(editorUid)
  expect(actualSelections).toEqual(new Uint32Array([0, 1, 0, 1]))
  expect(() => setSelections2(editorUid, new Uint32Array())).toThrow(new Error('Editor selections must contain one or more groups of four values'))
  EditorStates.dispose(editorUid)
})
