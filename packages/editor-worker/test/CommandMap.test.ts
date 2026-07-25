import { expect, test } from '@jest/globals'
import { KeyCode, WhenExpression } from '@lvce-editor/virtual-dom-worker'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('contains only the minimal editor integration commands', () => {
  expect(Object.keys(commandMap)).toEqual([
    'Editor.create',
    'Editor.create2',
    'Editor.deleteCharacterLeft',
    'Editor.deleteCharacterRight',
    'Editor.deleteWordLeft',
    'Editor.deleteWordRight',
    'Editor.diff2',
    'Editor.dispose',
    'Editor.getCommandIds',
    'Editor.getKeyBindings',
    'Editor.getQuickPickMenuEntries',
    'Editor.handleClick',
    'Editor.handleInput',
    'Editor.loadContent',
    'Editor.render2',
    'Editor.renderEventListeners',
    'Editor.setDiagnostics',
    'Editor.setSelections2',
    'Editor.updateDiagnostics',
    'Font.ensure',
    'Initialize.initialize',
    'TextDocumentWorker.setPort',
  ])
  expect(commandMap['Editor.getCommandIds']()).toEqual([
    'deleteCharacterLeft',
    'deleteCharacterRight',
    'deleteWordLeft',
    'deleteWordRight',
    'handleClick',
    'handleInput',
    'updateDiagnostics',
  ])
  expect(commandMap['Editor.getKeyBindings']()).toEqual([
    {
      command: 'Editor.deleteCharacterLeft',
      key: KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
  ])
  expect(commandMap['Editor.getQuickPickMenuEntries']()).toEqual([])
  expect(commandMap['Editor.handleClick']).toEqual(expect.any(Function))
  expect(commandMap['Editor.handleInput']).toEqual(expect.any(Function))
  expect(commandMap['Editor.loadContent']).toEqual(expect.any(Function))
  expect(commandMap['Editor.renderEventListeners']()).toEqual([
    {
      name: 3,
      params: ['handleClick', 'event.clientX', 'event.clientY'],
    },
    {
      name: 1,
      params: ['handleInput', 'event.target.value'],
    },
  ])
  expect(commandMap['Editor.setDiagnostics']).toEqual(expect.any(Function))
  expect(commandMap['Editor.setSelections2']).toEqual(expect.any(Function))
  expect(commandMap['Editor.updateDiagnostics']()).toBeUndefined()
  expect(commandMap['Font.ensure']()).toBeUndefined()
  expect(commandMap['Initialize.initialize']()).toBeUndefined()
  expect(commandMap['TextDocumentWorker.setPort']).toEqual(expect.any(Function))
})
