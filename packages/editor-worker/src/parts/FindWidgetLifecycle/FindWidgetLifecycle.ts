/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { EditorState } from '../EditorState/EditorState.ts'
import type { FindWidgetHandle } from '../FindWidgetHandle/FindWidgetHandle.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import { defaultDriver, type FindWidgetLifecycleDriver, type RemoveRequest } from '../FindWidgetLifecycleDriver/FindWidgetLifecycleDriver.ts'
import * as FindWidgetLifecycleReducer from '../FindWidgetLifecycleReducer/FindWidgetLifecycleReducer.ts'

export type OpenFindOutcome =
  | { readonly kind: 'already-open'; readonly instanceId: string }
  | { readonly kind: 'failed'; readonly error: unknown; readonly instanceId: string }
  | { readonly kind: 'opened'; readonly instanceId: string }
  | { readonly kind: 'superseded'; readonly instanceId: string }

export type CloseFindOutcome =
  | { readonly kind: 'already-closed' }
  | { readonly kind: 'closed'; readonly instanceId: string }
  | { readonly kind: 'stale-request'; readonly instanceId: string }

interface OperationContext {
  readonly editorUid: number
  readonly handle: FindWidgetHandle
  readonly rendererUidPromise: Promise<number>
}

interface Operation extends OperationContext {
  readonly initializePromise: Promise<OpenFindOutcome>
}

const driverRef: { value: FindWidgetLifecycleDriver } = {
  value: defaultDriver,
}
const operations = new Map<string, Operation>()

const isCurrent = (editorUid: number, instanceId: string): boolean => {
  return EditorStates.get(editorUid).findWidget?.instanceId === instanceId
}

const removeRequest = (operation: OperationContext, rendererUid: number, intentSequence: number): RemoveRequest => ({
  editorUid: operation.editorUid,
  instanceId: operation.handle.instanceId,
  intentSequence,
  kind: 'find',
  rendererUid,
})

const disposeResources = async (operation: OperationContext, rendererUid: number | undefined, intentSequence: number): Promise<void> => {
  const { instanceId } = operation.handle
  const removing = rendererUid === undefined ? Promise.resolve() : driverRef.value.remove(removeRequest(operation, rendererUid, intentSequence))
  await Promise.allSettled([removing, driverRef.value.dispose(instanceId)])
  if (operations.get(instanceId)?.handle === operation.handle) {
    operations.delete(instanceId)
  }
}

const failInitialization = async (operation: OperationContext, rendererUid: number | undefined, error: unknown): Promise<OpenFindOutcome> => {
  const { editorUid, handle } = operation
  const { instanceId, intentSequence } = handle
  if (isCurrent(editorUid, instanceId)) {
    EditorStates.set(FindWidgetLifecycleReducer.markFailed(EditorStates.get(editorUid), instanceId))
  }
  await disposeResources(operation, rendererUid, intentSequence)
  return { error, instanceId, kind: 'failed' }
}

const rejectAttach = async (operation: OperationContext, rendererUid: number): Promise<OpenFindOutcome> => {
  const { editorUid, handle } = operation
  const { instanceId, intentSequence } = handle
  if (isCurrent(editorUid, instanceId)) {
    EditorStates.set(FindWidgetLifecycleReducer.markFailed(EditorStates.get(editorUid), instanceId))
  }
  await disposeResources(operation, rendererUid, intentSequence)
  return { instanceId, kind: 'superseded' }
}

const initialize = async (operation: OperationContext, editor: EditorState): Promise<OpenFindOutcome> => {
  const { editorUid, handle, rendererUidPromise } = operation
  const { instanceId, intentSequence } = handle
  let rendererUid: number | undefined
  try {
    rendererUid = await rendererUidPromise
    if (!isCurrent(editorUid, instanceId)) {
      return { instanceId, kind: 'superseded' }
    }
    await driverRef.value.create(instanceId, rendererUid, editor)
    if (!isCurrent(editorUid, instanceId)) {
      return { instanceId, kind: 'superseded' }
    }
    await driverRef.value.loadContent(instanceId)
    if (!isCurrent(editorUid, instanceId)) {
      return { instanceId, kind: 'superseded' }
    }
    const commands = await driverRef.value.render(instanceId)
    if (!isCurrent(editorUid, instanceId)) {
      return { instanceId, kind: 'superseded' }
    }
    const attached = await driverRef.value.attach({
      commands,
      editorUid,
      instanceId,
      intentSequence,
      kind: 'find',
      rendererUid,
    })
    if (!attached) {
      return rejectAttach(operation, rendererUid)
    }
    if (!isCurrent(editorUid, instanceId)) {
      return { instanceId, kind: 'superseded' }
    }
    EditorStates.set(FindWidgetLifecycleReducer.markVisible(EditorStates.get(editorUid), instanceId))
    return { instanceId, kind: 'opened' }
  } catch (error) {
    return failInitialization(operation, rendererUid, error)
  }
}

export const open = async (uid: number): Promise<OpenFindOutcome> => {
  const editor = EditorStates.get(uid)
  const transition = FindWidgetLifecycleReducer.requestOpen(editor)
  EditorStates.set(transition.state)
  if (!transition.shouldStart) {
    return {
      instanceId: transition.handle.instanceId,
      kind: 'already-open',
    }
  }
  const rendererUidPromise = driverRef.value.allocateRendererId()
  const operationContext: OperationContext = {
    editorUid: uid,
    handle: transition.handle,
    rendererUidPromise,
  }
  const initializePromise = initialize(operationContext, editor)
  const operation: Operation = {
    ...operationContext,
    initializePromise,
  }
  operations.set(transition.handle.instanceId, operation)
  return operation.initializePromise
}

const cleanup = async (operation: Operation, intentSequence: number): Promise<void> => {
  let rendererUid: number | undefined
  try {
    rendererUid = await operation.rendererUidPromise
  } catch {
    // Initialization reports allocation failures through its typed outcome.
  }
  const removing = rendererUid === undefined ? Promise.resolve() : driverRef.value.remove(removeRequest(operation, rendererUid, intentSequence))
  await operation.initializePromise
  await Promise.allSettled([removing, driverRef.value.dispose(operation.handle.instanceId)])
  if (operations.get(operation.handle.instanceId) === operation) {
    operations.delete(operation.handle.instanceId)
  }
}

export const close = async (uid: number, expectedInstanceId?: string): Promise<CloseFindOutcome> => {
  const transition = FindWidgetLifecycleReducer.requestClose(EditorStates.get(uid), expectedInstanceId)
  if (!transition.shouldClose) {
    return expectedInstanceId
      ? {
          instanceId: expectedInstanceId,
          kind: 'stale-request',
        }
      : { kind: 'already-closed' }
  }
  EditorStates.set(transition.state)
  const { instanceId } = transition.handle!
  const operation = operations.get(instanceId)
  if (operation) {
    await cleanup(operation, transition.intentSequence)
  }
  return {
    instanceId,
    kind: 'closed',
  }
}

export const requestCloseFromWidget = (uid: number, expectedInstanceId: string): CloseFindOutcome => {
  const transition = FindWidgetLifecycleReducer.requestClose(EditorStates.get(uid), expectedInstanceId)
  if (!transition.shouldClose) {
    return {
      instanceId: expectedInstanceId,
      kind: 'stale-request',
    }
  }
  EditorStates.set(transition.state)
  const { instanceId } = transition.handle!
  const operation = operations.get(instanceId)
  if (operation) {
    void cleanup(operation, transition.intentSequence)
  }
  return {
    instanceId,
    kind: 'closed',
  }
}

export const execute = async (uid: number, method: string, ...args: readonly any[]): Promise<boolean> => {
  const { findWidget } = EditorStates.get(uid)
  if (!findWidget) {
    return false
  }
  const { instanceId, intentSequence } = findWidget
  const operation = operations.get(instanceId)
  if (!operation) {
    return false
  }
  const rendererUid = await operation.rendererUidPromise
  if (!isCurrent(uid, instanceId)) {
    return false
  }
  await driverRef.value.invoke(method, rendererUid, ...args)
  if (!isCurrent(uid, instanceId)) {
    return false
  }
  const commands = await driverRef.value.render(instanceId)
  if (!isCurrent(uid, instanceId)) {
    return false
  }
  return driverRef.value.update({
    commands,
    editorUid: uid,
    instanceId,
    intentSequence,
    kind: 'find',
    rendererUid,
  })
}

export const setDriver = (value: FindWidgetLifecycleDriver): void => {
  driverRef.value = value
}

export const reset = (): void => {
  operations.clear()
  driverRef.value = defaultDriver
}
