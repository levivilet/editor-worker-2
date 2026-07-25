import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetWindowId from '../src/parts/GetWindowId/GetWindowId.ts'

test('getWindowId - calls RendererWorker.invoke with correct arguments', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'GetWindowId.getWindowId'(): number {
      return 1
    },
  })
  const result = await GetWindowId.getWindowId()
  expect(mockRpc.invocations).toEqual([['GetWindowId.getWindowId']])
  expect(result).toBe(1)
})

test('getWindowId - handles error from RendererWorker', async () => {
  RendererWorker.registerMockRpc({
    'GetWindowId.getWindowId'(): never {
      throw new Error('Failed to get window id')
    },
  })
  await expect(GetWindowId.getWindowId()).rejects.toThrow('Failed to get window id')
})
