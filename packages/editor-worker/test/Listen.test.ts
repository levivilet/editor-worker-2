import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import * as Listen from '../src/parts/Listen/Listen.ts'

test('starts the editor worker rpc', async () => {
  const { dispose, start } = mockWorkerGlobalRpc()
  const listenPromise = Listen.listen()
  start()
  await expect(listenPromise).resolves.toBeUndefined()
  dispose()
})
