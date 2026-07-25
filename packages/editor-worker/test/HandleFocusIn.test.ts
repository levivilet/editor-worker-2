import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import * as HandleFocusIn from '../src/parts/HandleFocusIn/HandleFocusIn.ts'

const runHandleFocusIn = async (state: AboutState): Promise<AboutState> => {
  const { uid } = state
  AboutStates.set(uid, state, state)
  const command = AboutStates.wrapAsyncCommand(HandleFocusIn.handleFocusIn)
  await command(uid)
  return AboutStates.get(uid).newState
}

test('handleFocusIn - when focusId exists', async () => {
  const state: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.0.0', 'Commit: abc'],
    productName: 'Test Editor',
    uid: 1,
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Focus.setFocus'(value: number): void {
      if (value !== 4) {
        throw new Error('unexpected method Focus.setFocus')
      }
    },
  })
  const newState = await runHandleFocusIn(state)
  expect(newState).toBe(state)
  expect(mockRpc.invocations).toEqual([['Focus.setFocus', 4]])
})

test('handleFocusIn - when focusId is None', async () => {
  const state: AboutState = {
    focusId: AboutFocusId.None,
    lines: ['Version: 1.0.0', 'Commit: abc'],
    productName: 'Test Editor',
    uid: 1,
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Focus.setFocus'(value: number): void {
      if (value !== 4) {
        throw new Error('unexpected method Focus.setFocus')
      }
    },
  })
  const newState = await runHandleFocusIn(state)
  expect(newState).toEqual({
    ...state,
    focusId: AboutFocusId.Ok,
  })
  expect(mockRpc.invocations).toEqual([['Focus.setFocus', 4]])
})

test('handleFocusIn - when focusId is Copy', async () => {
  const state: AboutState = {
    focusId: AboutFocusId.Copy,
    lines: ['Version: 1.0.0', 'Commit: abc'],
    productName: 'Test Editor',
    uid: 1,
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'Focus.setFocus'(value: number): void {
      if (value !== 4) {
        throw new Error('unexpected method Focus.setFocus')
      }
    },
  })
  const newState = await runHandleFocusIn(state)
  expect(newState).toBe(state)
  expect(mockRpc.invocations).toEqual([['Focus.setFocus', 4]])
})

test('handleFocusIn preserves state updates made while the command is awaiting', async () => {
  const state: AboutState = {
    focusId: AboutFocusId.None,
    lines: ['old'],
    productName: 'Test Editor',
    uid: 1,
  }
  const { promise: focusStarted, resolve: notifyFocusStarted } = Promise.withResolvers<void>()
  const { promise: continueFocus, resolve: resolveFocus } = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({
    async 'Focus.setFocus'(): Promise<void> {
      notifyFocusStarted()
      await continueFocus
    },
  })
  const { uid } = state
  AboutStates.set(uid, state, state)
  const command = AboutStates.wrapAsyncCommand(HandleFocusIn.handleFocusIn)

  const pendingCommand = command(uid)
  await focusStarted
  const concurrentState = {
    ...state,
    lines: ['new'],
  }
  AboutStates.set(uid, state, concurrentState)
  resolveFocus()
  await pendingCommand

  expect(AboutStates.get(uid).newState).toEqual({
    ...concurrentState,
    focusId: AboutFocusId.Ok,
  })
  expect(mockRpc.invocations).toEqual([['Focus.setFocus', 4]])
})
