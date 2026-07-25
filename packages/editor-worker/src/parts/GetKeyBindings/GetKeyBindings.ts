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
      command: 'Editor.deleteCharacterRight',
      key: KeyCode.Delete,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorLeft',
      key: KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorRight',
      key: KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorUp',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorDown',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectLeft',
      key: KeyModifier.Shift | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectRight',
      key: KeyModifier.Shift | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectUp',
      key: KeyModifier.Shift | KeyCode.UpArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectDown',
      key: KeyModifier.Shift | KeyCode.DownArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorWordLeft',
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorWordRight',
      key: KeyModifier.CtrlCmd | KeyCode.RightArrow,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorHome',
      key: KeyCode.Home,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cursorEnd',
      key: KeyCode.End,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.insertLineBreak',
      key: KeyCode.Enter,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.insertTab',
      key: KeyCode.Tab,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.selectAll',
      key: KeyModifier.CtrlCmd | KeyCode.KeyA,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.copy',
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.cut',
      key: KeyModifier.CtrlCmd | KeyCode.KeyX,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.paste',
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.undo',
      key: KeyModifier.CtrlCmd | KeyCode.KeyZ,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.redo',
      key: KeyModifier.CtrlCmd | KeyModifier.Shift | KeyCode.KeyZ,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.save',
      key: KeyModifier.CtrlCmd | KeyCode.KeyS,
      when: WhenExpression.FocusEditorText,
    },
    {
      command: 'Editor.openFind2',
      key: KeyModifier.CtrlCmd | KeyCode.KeyF,
      when: WhenExpression.FocusEditorText,
    },
  ]
}
