import { expect, test, beforeAll } from '@jest/globals'
import * as GetAboutVirtualDom from '../src/parts/GetAboutVirtualDom/GetAboutVirtualDom.ts'

beforeAll(() => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  })
})

test('formatDate - 1 millisecond ago', () => {
  const productName = 'Lvce Editor - OSS'
  const lines = [
    'Version: 0.0.0-dev',
    'Commit: unknown commit',
    'Date: unknown',
    'Browser: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  ]
  const closeMessage = 'Close Dialog'
  const okMessage = 'Ok'
  const copyMessage = 'Copy'
  const infoMessage = 'Info'
  expect(GetAboutVirtualDom.getAboutVirtualDom(productName, lines, closeMessage, okMessage, copyMessage, infoMessage)).toEqual([
    {
      childCount: 1,
      className: 'Viewlet About',
      onContextMenu: 5,
      type: 4,
    },
    {
      ariaLabelledBy: 'DialogIcon DialogHeading',
      ariaModal: 'true',
      childCount: 3,
      className: 'DialogContent',
      onFocusIn: 6,
      role: 'dialog',
      tabIndex: -1,
      type: 4,
    },
    {
      childCount: 1,
      className: 'DialogToolBarRow',
      type: 4,
    },
    {
      ariaLabel: 'Close Dialog',
      childCount: 1,
      className: 'DialogClose',
      onClick: 1,
      type: 1,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: 4,
    },
    {
      childCount: 2,
      className: 'DialogMessageRow',
      type: 4,
    },
    {
      ariaLabel: 'Info',
      childCount: 0,
      className: 'DialogIcon DialogInfoIcon MaskIcon MaskIconInfo',
      id: 'DialogIcon',
      type: 4,
    },
    {
      childCount: 2,
      className: 'DialogContentRight',
      type: 4,
    },
    {
      childCount: 1,
      className: 'DialogHeading',
      id: 'DialogHeading',
      type: 4,
    },
    {
      childCount: 0,
      text: 'Lvce Editor - OSS',
      type: 12,
    },
    {
      childCount: 7,
      className: 'DialogMessage',
      type: 4,
    },
    {
      childCount: 0,
      text: 'Version: 0.0.0-dev',
      type: 12,
    },
    {
      childCount: 0,
      type: 55,
    },
    {
      childCount: 0,
      text: 'Commit: unknown commit',
      type: 12,
    },
    {
      childCount: 0,
      type: 55,
    },
    {
      childCount: 0,
      text: 'Date: unknown',
      type: 12,
    },
    {
      childCount: 0,
      type: 55,
    },
    {
      childCount: 0,
      text: 'Browser: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      type: 12,
    },
    {
      childCount: 2,
      className: 'DialogButtonsRow',
      type: 4,
    },
    {
      childCount: 1,
      className: 'Button ButtonSecondary',
      name: 'Ok',
      onClick: 4,
      type: 1,
    },
    {
      childCount: 0,
      text: 'Ok',
      type: 12,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary',
      name: 'Copy',
      onClick: 4,
      type: 1,
    },
    {
      childCount: 0,
      text: 'Copy',
      type: 12,
    },
  ])
})
