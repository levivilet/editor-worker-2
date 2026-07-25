import { expect, test } from '@jest/globals'
import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { highlightLines } from '../src/parts/HighlightLines/HighlightLines.ts'

test('falls back to plain text when syntax highlighting fails', async () => {
  SyntaxHighlightingWorker.set({
    dispose: async (): Promise<void> => {},
    invoke: async (): Promise<never> => {
      throw new Error('Failed to highlight')
    },
  } as any)

  await expect(highlightLines('const value = 1', 'typescript', '/tokenize-typescript.js', ['const value = 1'])).resolves.toEqual([
    ['const value = 1', 'Token Text'],
  ])

  await SyntaxHighlightingWorker.dispose()
})
