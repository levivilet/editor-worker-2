import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import * as Main from '../src/parts/Main/Main.ts'

test('starts the editor worker', async () => {
  const { dispose, start } = mockWorkerGlobalRpc()
  const mainPromise = Main.main()
  start()
  await expect(mainPromise).resolves.toBeUndefined()
  dispose()
})
