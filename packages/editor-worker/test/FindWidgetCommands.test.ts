import { expect, test } from '@jest/globals'
import { createCommandMap } from '../src/parts/FindWidgetCommands/FindWidgetCommands.ts'

test('forwards renderer events to the owning worker state', async () => {
  const calls: any[][] = []
  const execute = async (editorUid: number, method: string, ...params: readonly any[]): Promise<void> => {
    calls.push([editorUid, method, ...params])
  }
  const commandMap = createCommandMap(execute)

  await commandMap['FindWidget.handleInput'](42, 'needle')
  await commandMap['FindWidget.close'](42)
  await commandMap['FindWidget.handleClickReplace'](42)

  expect(calls).toEqual([
    [42, 'FindWidget.handleInput', 'needle'],
    [42, 'FindWidget.close'],
    [42, 'FindWidget.replace'],
  ])
})
