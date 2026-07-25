import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetConfigJsonPath from '../src/parts/GetConfigJsonPath/GetConfigJsonPath.ts'

test('getConfigJsonPath', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'PlatformPaths.getConfigJsonPath'(): string {
      return 'config.json'
    },
  })

  expect(await GetConfigJsonPath.getConfigJsonPath()).toBe('config.json')
  expect(mockRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
})
