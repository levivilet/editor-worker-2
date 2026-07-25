import { expect, test } from '@jest/globals'
import { KeyCode, KeyModifier, WhenExpression } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings returns the editor key bindings', (): void => {
  expect(getKeyBindings()).toEqual([
    {
      command: 'Editor.deleteCharacterLeft',
      key: KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openFind2',
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      when: WhenExpression.FocusEditorText,
    },
  ])
})
