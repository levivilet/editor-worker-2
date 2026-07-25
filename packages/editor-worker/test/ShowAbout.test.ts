import { expect, test } from '@jest/globals'
import { FileSystemWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'
import * as ShowAbout from '../src/parts/ShowAbout/ShowAbout.ts'

test('showAbout - web platform', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.openWidget'(widgetId: string): void {
      expect(widgetId).toBe('About')
    },
  })
  await ShowAbout.showAbout(PlatformType.Web)
})

test('showAbout - electron platform', async () => {
  let wasCalled = false
  FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(): string {
      return JSON.stringify({
        productName: 'Configured Editor',
      })
    },
  })
  RendererWorker.registerMockRpc({
    'ElectronDialog.showMessageBox'(): number {
      wasCalled = true
      return 1
    },
    'GetWindowId.getWindowId'(): number {
      return 1
    },
    'PlatformPaths.getConfigJsonPath'(): string {
      return 'config.json'
    },
    'Process.getChromeVersion'(): string {
      return '123.0.0'
    },
    'Process.getElectronVersion'(): string {
      return '1.0.0'
    },
    'Process.getNodeVersion'(): string {
      return '22.0.0'
    },
    'Process.getV8Version'(): string {
      return '10.0.0'
    },
  })
  await ShowAbout.showAbout(PlatformType.Electron)
  expect(wasCalled).toBe(true)
})

test('showAbout - error', async () => {
  RendererWorker.registerMockRpc({
    'Viewlet.openWidget'(): never {
      throw new Error('Failed to show about')
    },
  })
  await expect(ShowAbout.showAbout(PlatformType.Web)).rejects.toThrow('Failed to show about')
})
