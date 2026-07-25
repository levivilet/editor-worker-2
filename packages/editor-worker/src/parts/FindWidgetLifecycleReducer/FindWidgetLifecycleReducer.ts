import type { EditorState } from '../EditorState/EditorState.ts'
import type { FindWidgetHandle } from '../FindWidgetHandle/FindWidgetHandle.ts'

export interface OpenTransition {
  readonly handle: FindWidgetHandle
  readonly shouldStart: boolean
  readonly state: EditorState
}

export interface CloseTransition {
  readonly handle?: FindWidgetHandle
  readonly intentSequence: number
  readonly shouldClose: boolean
  readonly state: EditorState
}

export const requestOpen = (state: EditorState): OpenTransition => {
  const { findWidget, findWidgetInstanceSequence = 0, findWidgetIntentSequence = 0, uid } = state
  if (findWidget) {
    return {
      handle: findWidget,
      shouldStart: false,
      state,
    }
  }
  const intentSequence = findWidgetIntentSequence + 1
  const instanceSequence = findWidgetInstanceSequence + 1
  const handle: FindWidgetHandle = {
    instanceId: `editor:${uid}:find:${instanceSequence}`,
    intentSequence,
    kind: 'find',
    status: 'opening',
  }
  return {
    handle,
    shouldStart: true,
    state: {
      ...state,
      findWidget: handle,
      findWidgetInstanceSequence: instanceSequence,
      findWidgetIntentSequence: intentSequence,
      findWidgetVisible: true,
    },
  }
}

export const requestClose = (state: EditorState, expectedInstanceId?: string): CloseTransition => {
  const { findWidget: handle, findWidgetIntentSequence = 0 } = state
  if (!handle || (expectedInstanceId && handle.instanceId !== expectedInstanceId)) {
    return {
      intentSequence: findWidgetIntentSequence,
      shouldClose: false,
      state,
    }
  }
  const intentSequence = findWidgetIntentSequence + 1
  const { findWidget: _findWidget, ...rest } = state
  return {
    handle,
    intentSequence,
    shouldClose: true,
    state: {
      ...rest,
      findWidgetIntentSequence: intentSequence,
      findWidgetVisible: false,
    },
  }
}

export const markVisible = (state: EditorState, instanceId: string): EditorState => {
  const { findWidget } = state
  if (findWidget?.instanceId !== instanceId) {
    return state
  }
  return {
    ...state,
    findWidget: {
      ...findWidget,
      status: 'visible',
    },
  }
}

export const markFailed = (state: EditorState, instanceId: string): EditorState => {
  const { findWidget } = state
  if (findWidget?.instanceId !== instanceId) {
    return state
  }
  const { findWidget: _findWidget, ...rest } = state
  return {
    ...rest,
    findWidgetVisible: false,
  }
}
