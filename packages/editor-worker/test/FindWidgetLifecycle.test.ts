import { afterEach, beforeEach, expect, test } from '@jest/globals'
import type { AttachRequest, FindWidgetLifecycleDriver, RemoveRequest } from '../src/parts/FindWidgetLifecycleDriver/FindWidgetLifecycleDriver.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as FindWidgetLifecycle from '../src/parts/FindWidgetLifecycle/FindWidgetLifecycle.ts'

interface Deferred<T> {
  readonly promise: Promise<T>
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  readonly resolve: (value: T | PromiseLike<T>) => void
}

const deferred = <T>(): Deferred<T> => {
  const { promise, resolve } = Promise.withResolvers<T>()
  return { promise, resolve }
}

const testState: {
  allocateBarrier?: Deferred<void>
  allocationError?: Error
  attachBarrier?: Deferred<void>
  attachResult: boolean
  createBarrier?: Deferred<void>
  createError?: Error
  events: string[]
  invokeClosesWidget: boolean
  loadBarrier?: Deferred<void>
  nextRendererUid: number
  removeBarrier?: Deferred<void>
  removeError?: Error
  removeRequests: RemoveRequest[]
  renderBarrier?: Deferred<void>
  renderClosesWidget: boolean
  updateRequests: AttachRequest[]
} = {
  attachResult: true,
  events: [],
  invokeClosesWidget: false,
  nextRendererUid: 100,
  removeRequests: [],
  renderClosesWidget: false,
  updateRequests: [],
}

const driver: FindWidgetLifecycleDriver = {
  allocateRendererId: async () => {
    if (testState.allocationError) {
      throw testState.allocationError
    }
    await testState.allocateBarrier?.promise
    const rendererUid = testState.nextRendererUid++
    testState.events.push(`allocate:${rendererUid}`)
    return rendererUid
  },
  attach: async (request) => {
    testState.events.push(`attach:${request.instanceId}:${request.intentSequence}`)
    await testState.attachBarrier?.promise
    return testState.attachResult
  },
  create: async (instanceId) => {
    testState.events.push(`create:${instanceId}`)
    await testState.createBarrier?.promise
    if (testState.createError) {
      throw testState.createError
    }
  },
  dispose: async (instanceId) => {
    testState.events.push(`dispose:${instanceId}`)
  },
  invoke: async (method, ...params) => {
    testState.events.push(`invoke:${method}:${params.join(':')}`)
    if (testState.invokeClosesWidget) {
      FindWidgetLifecycle.requestCloseFromWidget(1, 'editor:1:find:1')
    }
  },
  loadContent: async (instanceId) => {
    testState.events.push(`load:${instanceId}`)
    await testState.loadBarrier?.promise
  },
  remove: async (request) => {
    testState.removeRequests.push(request)
    testState.events.push(`remove:${request.instanceId}:${request.intentSequence}`)
    await testState.removeBarrier?.promise
    if (testState.removeError) {
      throw testState.removeError
    }
  },
  render: async (instanceId) => {
    testState.events.push(`render:${instanceId}`)
    await testState.renderBarrier?.promise
    if (testState.renderClosesWidget) {
      FindWidgetLifecycle.requestCloseFromWidget(1, instanceId)
    }
    return []
  },
  update: async (request) => {
    testState.updateRequests.push(request)
    return true
  },
}

beforeEach(() => {
  testState.nextRendererUid = 100
  delete testState.allocateBarrier
  delete testState.attachBarrier
  delete testState.createBarrier
  delete testState.loadBarrier
  delete testState.removeBarrier
  delete testState.renderBarrier
  testState.events = []
  testState.invokeClosesWidget = false
  testState.removeRequests = []
  testState.renderClosesWidget = false
  testState.updateRequests = []
  delete testState.allocationError
  testState.attachResult = true
  delete testState.createError
  delete testState.removeError
  EditorStates.create(1)
  FindWidgetLifecycle.setDriver(driver)
})

afterEach(() => {
  EditorStates.dispose(1)
  FindWidgetLifecycle.reset()
})

test('close overtakes an opening widget without allowing a late attach', async () => {
  testState.createBarrier = deferred<void>()
  const opening = FindWidgetLifecycle.open(1)
  await Promise.resolve()
  await Promise.resolve()
  expect(testState.events).toContain('create:editor:1:find:1')

  const closing = FindWidgetLifecycle.close(1)
  expect(EditorStates.get(1).findWidgetVisible).toBe(false)
  testState.createBarrier.resolve()

  await expect(opening).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'superseded',
  })
  await expect(closing).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'closed',
  })
  expect(testState.events).not.toContain('attach:editor:1:find:1:1')
  expect(testState.events).toContain('remove:editor:1:find:1:2')
  expect(testState.events).toContain('dispose:editor:1:find:1')
})

test('a reopen wins while cleanup of the previous instance is still pending', async () => {
  const first = await FindWidgetLifecycle.open(1)
  testState.removeBarrier = deferred<void>()

  const closing = FindWidgetLifecycle.close(1)
  const reopening = FindWidgetLifecycle.open(1)
  const second = await reopening

  expect(first).toEqual({ instanceId: 'editor:1:find:1', kind: 'opened' })
  expect(second).toEqual({ instanceId: 'editor:1:find:2', kind: 'opened' })
  expect(EditorStates.get(1).findWidget?.instanceId).toBe('editor:1:find:2')
  expect(EditorStates.get(1).findWidgetVisible).toBe(true)
  expect(testState.removeRequests[0]?.intentSequence).toBe(2)
  expect(testState.events).toContain('attach:editor:1:find:2:3')

  testState.removeBarrier.resolve()
  await closing
  expect(EditorStates.get(1).findWidget?.instanceId).toBe('editor:1:find:2')
})

test('a stale widget callback cannot close its replacement', async () => {
  await FindWidgetLifecycle.open(1)
  await FindWidgetLifecycle.close(1)
  await FindWidgetLifecycle.open(1)

  await expect(FindWidgetLifecycle.close(1, 'editor:1:find:1')).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'stale-request',
  })
  expect(EditorStates.get(1).findWidget?.instanceId).toBe('editor:1:find:2')
})

test('duplicate opens reuse the in-flight instance', async () => {
  testState.createBarrier = deferred<void>()
  const first = FindWidgetLifecycle.open(1)
  await Promise.resolve()

  await expect(FindWidgetLifecycle.open(1)).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'already-open',
  })
  expect(testState.events.filter((event) => event.startsWith('allocate:'))).toHaveLength(1)

  testState.createBarrier.resolve()
  await first
})

test('reports renderer refusal as a superseded open', async () => {
  testState.attachResult = false

  await expect(FindWidgetLifecycle.open(1)).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'superseded',
  })
})

test('reports initialization failure and cleans up the allocated instance', async () => {
  testState.createError = new Error('create failed')

  await expect(FindWidgetLifecycle.open(1)).resolves.toEqual({
    error: testState.createError,
    instanceId: 'editor:1:find:1',
    kind: 'failed',
  })
  expect(EditorStates.get(1).findWidget).toBeUndefined()
  expect(testState.events).toContain('remove:editor:1:find:1:1')
  expect(testState.events).toContain('dispose:editor:1:find:1')
})

test('reports allocation failure without attempting renderer cleanup', async () => {
  testState.allocationError = new Error('allocation failed')

  await expect(FindWidgetLifecycle.open(1)).resolves.toEqual({
    error: testState.allocationError,
    instanceId: 'editor:1:find:1',
    kind: 'failed',
  })
  expect(EditorStates.get(1).findWidgetVisible).toBe(false)
  expect(testState.events).toEqual(['dispose:editor:1:find:1'])
})

test('close remains successful when cleanup reports an error', async () => {
  await FindWidgetLifecycle.open(1)
  testState.removeError = new Error('remove failed')

  await expect(FindWidgetLifecycle.close(1)).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'closed',
  })
  await expect(FindWidgetLifecycle.close(1)).resolves.toEqual({
    kind: 'already-closed',
  })
})

test('executes and renders an event against the current renderer instance', async () => {
  await FindWidgetLifecycle.open(1)
  testState.events = []

  await expect(FindWidgetLifecycle.execute(1, 'FindWidget.handleInput', 'needle')).resolves.toBe(true)

  expect(testState.events).toEqual(['invoke:FindWidget.handleInput:100:needle', 'render:editor:1:find:1'])
  expect(testState.updateRequests).toEqual([
    {
      commands: [],
      editorUid: 1,
      instanceId: 'editor:1:find:1',
      intentSequence: 1,
      kind: 'find',
      rendererUid: 100,
    },
  ])
})

test('widget initiated close returns before cleanup finishes', async () => {
  await FindWidgetLifecycle.open(1)
  testState.removeBarrier = deferred<void>()

  const outcome = FindWidgetLifecycle.requestCloseFromWidget(1, 'editor:1:find:1')

  expect(outcome).toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'closed',
  })
  expect(EditorStates.get(1).findWidgetVisible).toBe(false)
  testState.removeBarrier.resolve()
  await Promise.resolve()
  await Promise.resolve()
})

test('ignores events when no widget instance is current', async () => {
  await expect(FindWidgetLifecycle.execute(1, 'FindWidget.handleInput', 'needle')).resolves.toBe(false)
  expect(FindWidgetLifecycle.requestCloseFromWidget(1, 'editor:1:find:stale')).toEqual({
    instanceId: 'editor:1:find:stale',
    kind: 'stale-request',
  })
})

test('ignores events when the owning operation is gone', async () => {
  await FindWidgetLifecycle.open(1)
  FindWidgetLifecycle.reset()
  FindWidgetLifecycle.setDriver(driver)

  await expect(FindWidgetLifecycle.execute(1, 'FindWidget.handleInput', 'needle')).resolves.toBe(false)
})

test('stops rendering when an event closes its widget', async () => {
  await FindWidgetLifecycle.open(1)
  testState.invokeClosesWidget = true

  await expect(FindWidgetLifecycle.execute(1, 'FindWidget.close')).resolves.toBe(false)
})

test('stops updating when rendering closes its widget', async () => {
  await FindWidgetLifecycle.open(1)
  testState.renderClosesWidget = true

  await expect(FindWidgetLifecycle.execute(1, 'FindWidget.handleInput', 'needle')).resolves.toBe(false)
})

test('stops an event when close wins renderer allocation', async () => {
  testState.allocateBarrier = deferred<void>()
  const opening = FindWidgetLifecycle.open(1)
  const executing = FindWidgetLifecycle.execute(1, 'FindWidget.handleInput', 'needle')
  const closing = FindWidgetLifecycle.close(1)
  testState.allocateBarrier.resolve()

  await expect(executing).resolves.toBe(false)
  await opening
  await closing
})

test.each(['allocate', 'load', 'render', 'attach'] as const)('close wins while open is awaiting %s', async (stage) => {
  const barrier = deferred<void>()
  switch (stage) {
    case 'allocate':
      testState.allocateBarrier = barrier
      break
    case 'attach':
      testState.attachBarrier = barrier
      break
    case 'load':
      testState.loadBarrier = barrier
      break
    case 'render':
      testState.renderBarrier = barrier
      break
  }
  const opening = FindWidgetLifecycle.open(1)
  for (let index = 0; index < 12; index++) {
    await Promise.resolve()
  }

  const closing = FindWidgetLifecycle.close(1)
  barrier.resolve()

  await expect(opening).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'superseded',
  })
  await closing
  expect(EditorStates.get(1).findWidget).toBeUndefined()
})
