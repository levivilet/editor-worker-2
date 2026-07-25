import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as HandleClickButton from '../src/parts/HandleClickButton/HandleClickButton.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

test('handleClickButton - ok', async () => {
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
  const newState = await HandleClickButton.handleClickButton(state, InputName.Ok)
  expect(mockRpc.invocations).toEqual([['Viewlet.closeWidget', 'About']])
  expect(newState).toBe(state)
})

test('handleClickButton - close', async () => {
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
  const newState = await HandleClickButton.handleClickButton(state, InputName.Close)
  expect(mockRpc.invocations).toEqual([['Viewlet.closeWidget', 'About']])
  expect(newState).toBe(state)
})

test('handleClickButton - copy', async () => {
  const state: AboutState = {
    focusId: 1,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid: 1,
  }
  const calls: { method: string; args: readonly any[] }[] = []
  RendererWorker.registerMockRpc({
    'ClipBoard.writeText'(text: string): void {
      calls.push({ args: [text], method: 'ClipBoard.writeText' })
      if (text !== 'Version: 1.0.0') {
        throw new Error('unexpected method ClipBoard.writeText')
      }
    },
    'Viewlet.closeWidget'(widgetId: string): void {
      calls.push({ args: [widgetId], method: 'Viewlet.closeWidget' })
      if (widgetId !== 'About') {
        throw new Error('unexpected method Viewlet.closeWidget')
      }
    },
  })
  const newState = await HandleClickButton.handleClickButton(state, InputName.Copy)
  expect(calls).toEqual([
    { args: ['Version: 1.0.0'], method: 'ClipBoard.writeText' },
    { args: ['About'], method: 'Viewlet.closeWidget' },
  ])
  expect(newState).toBe(state)
})

test('handleClickButton - error', async () => {
  const state: AboutState = {
    focusId: 1,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid: 1,
  }
  await expect(HandleClickButton.handleClickButton(state, 'abc')).rejects.toThrow(new Error('unexpected button'))
})
