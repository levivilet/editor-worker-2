import { expect, test, beforeAll } from '@jest/globals'
import * as GetBrowser from '../src/parts/GetBrowser/GetBrowser.ts'

beforeAll(() => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: 'test',
    },
  })
})

test('getBrowser', () => {
  expect(GetBrowser.getBrowser()).toBe('test')
})
