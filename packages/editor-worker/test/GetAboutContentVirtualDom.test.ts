import { expect, test } from '@jest/globals'
import * as GetAboutContentVirtualDom from '../src/parts/GetAboutContentVirtualDom/GetAboutContentVirtualDom.ts'

test('formatDate - 1 millisecond ago', () => {
  const lines = ['Date: today', 'Commit: abc']
  expect(GetAboutContentVirtualDom.getAboutContentVirtualDom(lines)).toEqual([
    {
      childCount: 3,
      className: 'DialogMessage',
      type: 4,
    },
    {
      childCount: 0,
      text: 'Date: today',
      type: 12,
    },
    {
      childCount: 0,
      type: 55,
    },
    {
      childCount: 0,
      text: 'Commit: abc',
      type: 12,
    },
  ])
})
