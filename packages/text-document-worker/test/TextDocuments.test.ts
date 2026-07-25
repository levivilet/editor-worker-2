import { expect, test } from '@jest/globals'
import * as TextDocuments from '../src/parts/TextDocuments/TextDocuments.ts'

test('stores content and returns requested line ranges', () => {
  expect(TextDocuments.setContent(1, 'zero\none\ntwo\nthree')).toBe(4)
  expect(TextDocuments.getLines(1, 1, 3)).toEqual(['one', 'two'])
  expect(TextDocuments.getLines(1, 3, 10)).toEqual(['three'])
  TextDocuments.dispose(1)
  expect(() => TextDocuments.getLines(1, 0, 1)).toThrow(new Error('Text document not found: 1'))
})

test('isolates documents', () => {
  TextDocuments.setContent(1, 'one')
  TextDocuments.setContent(2, 'two')
  expect(TextDocuments.getLines(1, 0, 1)).toEqual(['one'])
  expect(TextDocuments.getLines(2, 0, 1)).toEqual(['two'])
  TextDocuments.dispose(1)
  TextDocuments.dispose(2)
})
