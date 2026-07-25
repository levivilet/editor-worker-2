import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Process from '../src/parts/Process/Process.ts'

test('getElectronVersion', async () => {
  RendererWorker.registerMockRpc({
    'Process.getElectronVersion'(): string {
      return ''
    },
  })
  expect(await Process.getElectronVersion()).toBe('')
})

test('getNodeVersion', async () => {
  RendererWorker.registerMockRpc({
    'Process.getNodeVersion'(): string {
      return ''
    },
  })
  expect(await Process.getNodeVersion()).toBe('')
})

test('getChromeVersion', async () => {
  RendererWorker.registerMockRpc({
    'Process.getChromeVersion'(): string {
      return ''
    },
  })
  expect(await Process.getChromeVersion()).toBe('')
})

test('getV8Version', async () => {
  RendererWorker.registerMockRpc({
    'Process.getV8Version'(): undefined {
      return undefined
    },
  })
  expect(await Process.getV8Version()).toBeUndefined()
})
