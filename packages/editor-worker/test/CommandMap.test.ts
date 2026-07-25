import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('contains only the minimal editor integration commands', () => {
  expect(Object.keys(commandMap)).toEqual([
    'Editor.create',
    'Editor.create2',
    'Editor.diff2',
    'Editor.dispose',
    'Editor.getCommandIds',
    'Editor.getKeyBindings',
    'Editor.getQuickPickMenuEntries',
    'Editor.loadContent',
    'Editor.render2',
    'Editor.renderEventListeners',
    'Editor.setSelections2',
    'Editor.updateDiagnostics',
    'Font.ensure',
    'Initialize.initialize',
  ])
  expect(commandMap['Editor.getCommandIds']()).toEqual(['updateDiagnostics'])
  expect(commandMap['Editor.getKeyBindings']()).toEqual([])
  expect(commandMap['Editor.getQuickPickMenuEntries']()).toEqual([])
  expect(commandMap['Editor.loadContent']).toEqual(expect.any(Function))
  expect(commandMap['Editor.renderEventListeners']()).toEqual([])
  expect(commandMap['Editor.setSelections2']()).toBeUndefined()
  expect(commandMap['Editor.updateDiagnostics']()).toBeUndefined()
  expect(commandMap['Font.ensure']()).toBeUndefined()
  expect(commandMap['Initialize.initialize']()).toBeUndefined()
})
