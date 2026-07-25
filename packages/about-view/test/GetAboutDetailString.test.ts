import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetAboutDetailString from '../src/parts/GetAboutDetailString/GetAboutDetailString.ts'

test('getDetailString', async () => {
  RendererWorker.registerMockRpc({
    'Process.getChromeVersion'(): string {
      return '0.0.0-dev'
    },
    'Process.getElectronVersion'(): string {
      return '0.0.0-dev'
    },
    'Process.getNodeVersion'(): string {
      return '0.0.0-dev'
    },
    'Process.getV8Version'(): string {
      return '0.0.0-dev'
    },
  })
  const config = {
    commit: 'abc123',
    date: '',
    productName: 'Test Editor',
    version: '1.2.3',
  }
  expect(await GetAboutDetailString.getDetailString(config)).toBe(
    `Version: 1.2.3\nCommit: abc123\nDate: unknown\nElectron: 0.0.0-dev\nChromium: 0.0.0-dev\nNode: 0.0.0-dev\nV8: 0.0.0-dev`,
  )
})
