import { beforeEach, expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

beforeEach(() => {
  AboutStates.clear()
})

const uid = 1

test('render - no changes', () => {
  const oldState: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid,
  }
  const newState: AboutState = {
    ...oldState,
  }
  AboutStates.set(uid, oldState, newState)
  const diffResult = Diff2.diff2(uid)
  expect(Render2.doRender(uid, diffResult)).toEqual([])
})

test('render - content changed', () => {
  const oldState: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid,
  }
  const newState: AboutState = {
    ...oldState,
    lines: ['Version: 2.0.0'],
  }
  AboutStates.set(uid, oldState, newState)
  const diffResult = Diff2.diff2(uid)
  expect(Render2.doRender(uid, diffResult)).toEqual([
    [
      'Viewlet.setDom2',
      expect.arrayContaining([
        expect.objectContaining({
          className: 'Viewlet About',
        }),
      ]),
    ],
  ])
})

test('render - focus changed', () => {
  const oldState: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid,
  }
  const newState: AboutState = {
    ...oldState,
    focusId: AboutFocusId.Copy,
  }
  AboutStates.set(uid, oldState, newState)
  const diffResult = Diff2.diff2(uid)

  expect(Render2.doRender(uid, diffResult)).toEqual([
    ['Viewlet.focusSelector', '[name="Copy"]'],
    ['Viewlet.setFocusContext', uid, 4],
  ])
})

test('render - both content and focus changed', () => {
  const oldState: AboutState = {
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.0.0'],
    productName: 'Test Editor',
    uid,
  }
  const newState: AboutState = {
    focusId: AboutFocusId.Copy,
    lines: ['Version: 2.0.0'],
    productName: 'Test Editor 2',
    uid: 1,
  }
  AboutStates.set(uid, oldState, newState)
  const diffResult = Diff2.diff2(uid)
  expect(Render2.doRender(uid, diffResult)).toEqual([
    [
      'Viewlet.setDom2',
      expect.arrayContaining([
        expect.objectContaining({
          className: 'Viewlet About',
        }),
      ]),
    ],
    ['Viewlet.focusSelector', '[name="Copy"]'],
    ['Viewlet.setFocusContext', uid, 4],
  ])
})
