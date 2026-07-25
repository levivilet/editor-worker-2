import { afterEach, expect, test } from '@jest/globals'
import * as TextDocuments from '../src/parts/TextDocuments/TextDocuments.ts'

const id = 100

afterEach(() => {
  TextDocuments.dispose(id)
})

test('preserves CRLF and normalizes inserted line endings', () => {
  TextDocuments.setContent(id, 'one\r\ntwo')
  TextDocuments.cursorDocumentEnd(id)
  TextDocuments.type(id, '\r\nthree\rfour')

  expect(TextDocuments.getText(id)).toBe('one\r\ntwo\r\nthree\r\nfour')
})

test('uses LF when it is the first source line ending', () => {
  TextDocuments.setContent(id, 'one\ntwo\r\nthree')

  expect(TextDocuments.getText(id)).toBe('one\ntwo\nthree')
})

test('clamps selections and returns forward and reversed selected text', () => {
  TextDocuments.setContent(id, 'zero\none\ntwo')
  expect(TextDocuments.setSelections(id, [-1, -1, 20, 20]).selections).toEqual([0, 0, 2, 3])
  expect(TextDocuments.getSelectedText(id)).toBe('zero\none\ntwo')
  TextDocuments.setSelections(id, [2, 3, 1, 1])
  expect(TextDocuments.getSelectedText(id)).toBe('ne\ntwo')
})

test('validates selection groups', () => {
  TextDocuments.setContent(id, '')

  expect(() => TextDocuments.setSelections(id, [])).toThrow('Text document selections must contain one or more groups of four values')
  expect(() => TextDocuments.setSelections(id, [0, 0])).toThrow('Text document selections must contain one or more groups of four values')
})

test('types over a selection and records document state', () => {
  TextDocuments.setContent(id, 'hello world')
  TextDocuments.setSelections(id, [0, 6, 0, 11])

  expect(TextDocuments.type(id, 'editor')).toMatchObject({
    canUndo: true,
    longestLineLength: 12,
    modified: true,
    selections: [0, 12, 0, 12],
    version: 2,
  })
  expect(TextDocuments.getText(id)).toBe('hello editor')
})

test('updates longest-line metadata incrementally through edits and history', () => {
  TextDocuments.setContent(id, 'longest line\nmedium')
  TextDocuments.setSelections(id, [0, 0, 0, 12])

  expect(TextDocuments.type(id, 'tiny').longestLineLength).toBe(6)
  expect(TextDocuments.undo(id).longestLineLength).toBe(12)
  expect(TextDocuments.redo(id).longestLineLength).toBe(6)
})

test('pastes multiline text into multiple selections', () => {
  TextDocuments.setContent(id, 'ab\ncd')
  TextDocuments.setSelections(id, [0, 1, 0, 1, 1, 1, 1, 1])

  expect(TextDocuments.pasteText(id, 'X\nY').selections).toEqual([1, 1, 1, 1, 3, 1, 3, 1])
  expect(TextDocuments.getText(id)).toBe('aX\nYb\ncX\nYd')
})

test('deletes graphemes and joins lines in both directions', () => {
  TextDocuments.setContent(id, 'a👮🏽‍♀️\nb')
  TextDocuments.setSelections(id, [0, 8, 0, 8])
  TextDocuments.deleteCharacterLeft(id)
  expect(TextDocuments.getText(id)).toBe('a\nb')
  TextDocuments.deleteCharacterRight(id)
  expect(TextDocuments.getText(id)).toBe('ab')
  TextDocuments.deleteCharacterLeft(id)
  expect(TextDocuments.getText(id)).toBe('b')
})

test('does nothing when deleting at document boundaries', () => {
  TextDocuments.setContent(id, 'abc')
  expect(TextDocuments.deleteCharacterLeft(id).selections).toEqual([0, 0, 0, 0])
  TextDocuments.cursorDocumentEnd(id)
  TextDocuments.deleteCharacterRight(id)
  expect(TextDocuments.getText(id)).toBe('abc')
})

test('deletes words, whitespace, punctuation, and whole line sides', () => {
  TextDocuments.setContent(id, 'foo  !!! bar')
  TextDocuments.setSelections(id, [0, 12, 0, 12])
  TextDocuments.deleteWordLeft(id)
  expect(TextDocuments.getText(id)).toBe('foo  !!! ')
  TextDocuments.deleteWordLeft(id)
  expect(TextDocuments.getText(id)).toBe('foo  ')
  TextDocuments.deleteWordLeft(id)
  expect(TextDocuments.getText(id)).toBe('')

  TextDocuments.setContent(id, 'foo  !!! bar')
  TextDocuments.deleteWordRight(id)
  expect(TextDocuments.getText(id)).toBe('  !!! bar')
  TextDocuments.deleteWordRight(id)
  expect(TextDocuments.getText(id)).toBe(' bar')
  TextDocuments.setSelections(id, [0, 1, 0, 1])
  TextDocuments.deleteAllRight(id)
  expect(TextDocuments.getText(id)).toBe(' ')
  TextDocuments.deleteAllLeft(id)
  expect(TextDocuments.getText(id)).toBe('')
})

test('deletes active selections regardless of direction', () => {
  TextDocuments.setContent(id, 'alpha beta')
  TextDocuments.setSelections(id, [0, 2, 0, 8])
  TextDocuments.deleteCharacterRight(id)
  expect(TextDocuments.getText(id)).toBe('alta')
})

test('inserts an indented line break and tab stops', () => {
  TextDocuments.setContent(id, '  value')
  TextDocuments.setSelections(id, [0, 4, 0, 4])
  expect(TextDocuments.insertLineBreak(id).selections).toEqual([1, 2, 1, 2])
  expect(TextDocuments.getText(id)).toBe('  va\n  lue')
  TextDocuments.insertTab(id, 4)
  expect(TextDocuments.getText(id)).toBe('  va\n    lue')
})

test('moves by grapheme, word, line, and document boundaries', () => {
  TextDocuments.setContent(id, 'a👮🏽‍♀️ word\nxy\nlong')
  TextDocuments.cursorRight(id)
  expect(TextDocuments.cursorRight(id).selections).toEqual([0, 8, 0, 8])
  expect(TextDocuments.cursorWordRight(id).selections).toEqual([0, 13, 0, 13])
  expect(TextDocuments.cursorWordRight(id).selections).toEqual([1, 0, 1, 0])
  expect(TextDocuments.cursorRight(id).selections).toEqual([1, 1, 1, 1])
  expect(TextDocuments.cursorEnd(id).selections).toEqual([1, 2, 1, 2])
  expect(TextDocuments.cursorDown(id).selections).toEqual([2, 2, 2, 2])
  expect(TextDocuments.cursorUp(id).selections).toEqual([1, 2, 1, 2])
  expect(TextDocuments.cursorHome(id).selections).toEqual([1, 0, 1, 0])
  expect(TextDocuments.cursorLeft(id).selections).toEqual([0, 13, 0, 13])
  expect(TextDocuments.cursorWordLeft(id).selections).toEqual([0, 9, 0, 9])
  expect(TextDocuments.cursorDocumentEnd(id).selections).toEqual([2, 4, 2, 4])
  expect(TextDocuments.cursorDocumentStart(id).selections).toEqual([0, 0, 0, 0])
})

test('preserves the desired column during vertical movement', () => {
  TextDocuments.setContent(id, '12345\nx\n12345')
  TextDocuments.setSelections(id, [0, 5, 0, 5])

  expect(TextDocuments.cursorDown(id).selections).toEqual([1, 1, 1, 1])
  expect(TextDocuments.cursorDown(id).selections).toEqual([2, 5, 2, 5])
})

test('extends selections in every direction', () => {
  TextDocuments.setContent(id, 'foo bar\nxy')
  TextDocuments.setSelections(id, [0, 4, 0, 4])

  expect(TextDocuments.selectLeft(id).selections).toEqual([0, 4, 0, 3])
  expect(TextDocuments.selectRight(id).selections).toEqual([0, 4, 0, 4])
  expect(TextDocuments.selectWordRight(id).selections).toEqual([0, 4, 0, 7])
  expect(TextDocuments.selectWordLeft(id).selections).toEqual([0, 4, 0, 4])
  expect(TextDocuments.selectHome(id).selections).toEqual([0, 4, 0, 0])
  expect(TextDocuments.selectEnd(id).selections).toEqual([0, 4, 0, 7])
  expect(TextDocuments.selectDown(id).selections).toEqual([0, 4, 1, 2])
  expect(TextDocuments.selectUp(id).selections).toEqual([0, 4, 0, 7])
})

test('collapses selections toward the requested edge', () => {
  TextDocuments.setContent(id, 'abcdef')
  TextDocuments.setSelections(id, [0, 1, 0, 5])
  expect(TextDocuments.cursorLeft(id).selections).toEqual([0, 1, 0, 1])
  TextDocuments.setSelections(id, [0, 5, 0, 1])
  expect(TextDocuments.cursorRight(id).selections).toEqual([0, 5, 0, 5])
})

test('selects the complete document', () => {
  TextDocuments.setContent(id, 'one\ntwo')

  expect(TextDocuments.selectAll(id).selections).toEqual([0, 0, 1, 3])
  expect(TextDocuments.getSelectedText(id)).toBe('one\ntwo')
})

test('applies ordered edits and supports undo and redo', () => {
  TextDocuments.setContent(id, 'zero\none\ntwo')
  TextDocuments.applyEdits(id, [
    {
      range: {
        end: { columnIndex: 4, rowIndex: 0 },
        start: { columnIndex: 0, rowIndex: 0 },
      },
      text: '0',
    },
    {
      range: {
        end: { columnIndex: 3, rowIndex: 2 },
        start: { columnIndex: 0, rowIndex: 2 },
      },
      text: '2',
    },
  ])
  expect(TextDocuments.getText(id)).toBe('0\none\n2')
  expect(TextDocuments.undo(id)).toMatchObject({ canRedo: true, modified: false })
  expect(TextDocuments.getText(id)).toBe('zero\none\ntwo')
  expect(TextDocuments.redo(id)).toMatchObject({ canRedo: false, canUndo: true, modified: true })
  expect(TextDocuments.getText(id)).toBe('0\none\n2')
})

test('groups adjacent typing and invalidates redo after a new edit', () => {
  TextDocuments.setContent(id, '')
  TextDocuments.type(id, 'a')
  TextDocuments.type(id, 'b')
  TextDocuments.type(id, 'c')
  TextDocuments.undo(id)
  expect(TextDocuments.getText(id)).toBe('')
  expect(TextDocuments.redo(id).canUndo).toBe(true)
  TextDocuments.undo(id)
  TextDocuments.pasteText(id, 'x')
  expect(TextDocuments.getSnapshot(id).canRedo).toBe(false)
})

test('undo and redo are no-ops without history', () => {
  TextDocuments.setContent(id, 'value')

  expect(TextDocuments.undo(id).version).toBe(1)
  expect(TextDocuments.redo(id).version).toBe(1)
})

test('marks only the current version as saved', () => {
  TextDocuments.setContent(id, 'value')
  const changed = TextDocuments.type(id, 'x')
  expect(() => TextDocuments.markSaved(id, changed.version - 1)).toThrow('Cannot mark stale text document version as saved')
  expect(TextDocuments.markSaved(id, changed.version).modified).toBe(false)
})

test('converts between positions and offsets with clamping', () => {
  TextDocuments.setContent(id, 'zero\none\ntwo')

  expect(TextDocuments.offsetAt(id, 1, 2)).toBe(7)
  expect(TextDocuments.offsetAt(id, 100, 100)).toBe(12)
  expect(TextDocuments.positionAt(id, 7)).toEqual({ columnIndex: 2, rowIndex: 1 })
  expect(TextDocuments.positionAt(id, 100)).toEqual({ columnIndex: 3, rowIndex: 2 })
})

test('deletes first, middle, last, and selected lines', () => {
  TextDocuments.setContent(id, 'zero\none\ntwo\nthree')
  TextDocuments.setSelections(id, [1, 2, 1, 2])
  TextDocuments.deleteLine(id)
  expect(TextDocuments.getText(id)).toBe('zero\ntwo\nthree')
  TextDocuments.setSelections(id, [2, 0, 2, 0])
  TextDocuments.deleteLine(id)
  expect(TextDocuments.getText(id)).toBe('zero\ntwo')
  TextDocuments.setSelections(id, [0, 0, 0, 0])
  TextDocuments.deleteLine(id)
  expect(TextDocuments.getText(id)).toBe('two')
  TextDocuments.deleteLine(id)
  expect(TextDocuments.getText(id)).toBe('')
})

test('indents and unindents selected lines', () => {
  TextDocuments.setContent(id, 'one\n  two\nthree')
  TextDocuments.setSelections(id, [0, 0, 2, 5])
  TextDocuments.indent(id, 2)
  expect(TextDocuments.getText(id)).toBe('  one\n    two\n  three')
  TextDocuments.setSelections(id, [0, 0, 2, 7])
  TextDocuments.unindent(id, 2)
  expect(TextDocuments.getText(id)).toBe('one\n  two\nthree')
})

test('extends a selection to document boundaries', () => {
  TextDocuments.setContent(id, 'one\ntwo')
  TextDocuments.setSelections(id, [0, 2, 0, 2])

  expect(TextDocuments.selectDocumentEnd(id).selections).toEqual([0, 2, 1, 3])
  expect(TextDocuments.selectDocumentStart(id).selections).toEqual([0, 2, 0, 0])
})
