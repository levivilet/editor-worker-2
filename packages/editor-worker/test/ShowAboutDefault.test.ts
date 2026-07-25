import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ShowAboutDefault from '../src/parts/ShowAboutDefault/ShowAboutDefault.ts'

test('showAboutDefault - opens About widget', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.openWidget'(widgetId: string): void {
      expect(widgetId).toBe('About')
    },
  })
  await ShowAboutDefault.showAboutDefault()
})

test('showAboutDefault - handles error', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.openWidget'(): never {
      throw new Error('Failed to open widget')
    },
  })
  await expect(ShowAboutDefault.showAboutDefault()).rejects.toThrow('Failed to open widget')
})
