import { KeyCode, KeyModifier, WhenExpression } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
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
  ]
}
