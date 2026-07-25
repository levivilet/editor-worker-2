import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'About.handleClickClose',
      key: KeyCode.Escape,
      when: WhenExpression.FocusAbout,
    },
    {
      command: 'About.focusNext',
      key: KeyCode.Tab,
      when: WhenExpression.FocusAbout,
    },
    {
      command: 'About.focusPrevious',
      key: KeyCode.Tab | KeyModifier.Shift,
      when: WhenExpression.FocusAbout,
    },
  ]
}
