import { afterEach, expect, test } from '@jest/globals'
import type { FindWidgetLifecycleDriver } from '../src/parts/FindWidgetLifecycleDriver/FindWidgetLifecycleDriver.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as FindWidgetLifecycle from '../src/parts/FindWidgetLifecycle/FindWidgetLifecycle.ts'
import { openFind } from '../src/parts/OpenFind/OpenFind.ts'

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

test('shows the find widget and reports its instance', async () => {
  EditorStates.create(1)
  FindWidgetLifecycle.setDriver(driver)

  const opening = openFind(1)

  expect(EditorStates.get(1).findWidgetVisible).toBe(true)
  await expect(opening).resolves.toEqual({
    instanceId: 'editor:1:find:1',
    kind: 'opened',
  })
  expect(EditorStates.get(1).findWidget?.status).toBe('visible')
})
