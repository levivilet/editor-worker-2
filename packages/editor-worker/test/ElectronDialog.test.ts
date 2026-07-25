import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ElectronDialog from '../src/parts/ElectronDialog/ElectronDialog.ts'

test('showMessageBox - calls RendererWorker.invoke with correct arguments', async () => {
  const calls: { method: string; args: readonly any[] }[] = []
  RendererWorker.registerMockRpc({
    'ElectronDialog.showMessageBox'(options: any): number {
      calls.push({ args: [options], method: 'ElectronDialog.showMessageBox' })
      return 1
    },
    'GetWindowId.getWindowId'(): number {
      calls.push({ args: [], method: 'GetWindowId.getWindowId' })
      return 1
    },
  })
  const options = {
    buttons: ['Ok', 'Cancel'],
    detail: 'test detail',
    message: 'test message',
    productName: 'Configured Editor',
    type: 'info',
    windowId: 1,
  }
  const result = await ElectronDialog.showMessageBox(options)
  expect(calls).toContainEqual({ args: [options], method: 'ElectronDialog.showMessageBox' })
  expect(result).toBe(1)
})

test('showMessageBox - handles error from RendererWorker', async () => {
  RendererWorker.registerMockRpc({
    'ElectronDialog.showMessageBox'(): never {
      throw new Error('Failed to show message box')
    },
    'GetWindowId.getWindowId'(): number {
      return 1
    },
  })
  const options = {
    buttons: ['Ok'],
    message: 'test message',
    productName: 'Configured Editor',
    type: 'info',
    windowId: 1,
  }
  await expect(ElectronDialog.showMessageBox(options)).rejects.toThrow('Failed to show message box')
})
