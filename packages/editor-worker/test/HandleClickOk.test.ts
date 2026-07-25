import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as HandleClickOk from '../src/parts/HandleClickOk/HandleClickOk.ts'

test('handleClickOk', async () => {
  const state: AboutState = {
    focusId: 1,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid: 1,
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.closeWidget'(widgetId: string): void {
      if (widgetId !== 'About') {
        throw new Error('unexpected method Viewlet.closeWidget')
      }
    },
  })
  const newState = await HandleClickOk.handleClickOk(state)
  expect(mockRpc.invocations).toEqual([['Viewlet.closeWidget', 'About']])
  expect(newState).toBe(state)
})

test('handleClickOk - error', async () => {
  const state: AboutState = {
    focusId: 1,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid: 1,
  }
  const error = new Error('Failed to close widget')
  RendererWorker.registerMockRpc({
    'Viewlet.closeWidget'(widgetId: string): never {
      if (widgetId === 'About') {
        throw error
      }
      throw new Error('unexpected method Viewlet.closeWidget')
    },
  })
  await expect(HandleClickOk.handleClickOk(state)).rejects.toThrow('Failed to close widget')
})
