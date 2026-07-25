import { afterEach, expect, test } from '@jest/globals'
import type { FindWidgetLifecycleDriver } from '../src/parts/FindWidgetLifecycleDriver/FindWidgetLifecycleDriver.ts'
import { closeFind } from '../src/parts/CloseFind/CloseFind.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as FindWidgetLifecycle from '../src/parts/FindWidgetLifecycle/FindWidgetLifecycle.ts'

const driver: FindWidgetLifecycleDriver = {
  allocateRendererId: async () => 42,
  attach: async () => true,
  create: async () => {},
  dispose: async () => {},
  invoke: async () => {},
  loadContent: async () => {},
  remove: async () => {},
  render: async () => [],
  update: async () => true,
}

afterEach(() => {
  EditorStates.dispose(1)
  FindWidgetLifecycle.reset()
})

test('hides and disposes the current find widget', async () => {
  EditorStates.create(1)
  FindWidgetLifecycle.setDriver(driver)
  await FindWidgetLifecycle.open(1)

  const closing = closeFind(1)

  expect(EditorStates.get(1).findWidgetVisible).toBe(false)
  await expect(closing).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'closed',
  })
  expect(EditorStates.get(1).findWidget).toBeUndefined()
})
