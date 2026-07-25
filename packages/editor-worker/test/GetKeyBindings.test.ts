import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings returns the complete basic editing bindings', (): void => {
  const keyBindings = getKeyBindings()
  expect(keyBindings.map(({ command }) => command)).toEqual([
    'Editor.deleteCharacterLeft',
    'Editor.deleteCharacterRight',
    'Editor.cursorLeft',
    'Editor.cursorRight',
    'Editor.cursorUp',
    'Editor.cursorDown',
    'Editor.selectLeft',
    'Editor.selectRight',
    'Editor.selectUp',
    'Editor.selectDown',
    'Editor.cursorWordLeft',
    'Editor.cursorWordRight',
    'Editor.cursorHome',
    'Editor.cursorEnd',
    'Editor.insertLineBreak',
    'Editor.insertTab',
    'Editor.selectAll',
    'Editor.copy',
    'Editor.cut',
    'Editor.paste',
    'Editor.undo',
    'Editor.redo',
    'Editor.save',
    'Editor.openFind2',
  ])
  expect(keyBindings.every(({ when }) => when === WhenExpression.FocusEditorText)).toBe(true)
  expect(new Set(keyBindings.map(({ key }) => key)).size).toBe(keyBindings.length)
})
