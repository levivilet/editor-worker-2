import { expect, test } from '@jest/globals'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual([
    {
      command: 'About.handleClickClose',
      key: 8,
      when: 4,
    },
    {
      command: 'About.focusNext',
      key: 2,
      when: 4,
    },
    {
      command: 'About.focusPrevious',
      key: 1026,
      when: 4,
    },
  ])
})
