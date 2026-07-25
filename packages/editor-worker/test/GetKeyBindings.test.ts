import { expect, test } from '@jest/globals'
import { KeyCode, WhenExpression } from '@lvce-editor/virtual-dom-worker'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings returns the editor key bindings', (): void => {
  expect(getKeyBindings()).toEqual([
    {
      command: 'Editor.deleteCharacterLeft',
      key: KeyCode.Backspace,
      when: WhenExpression.FocusEditorText,
    },
  ])
})
