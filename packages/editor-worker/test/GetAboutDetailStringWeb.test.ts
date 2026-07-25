import { expect, test, beforeAll } from '@jest/globals'
import * as GetAboutDetailStringWeb from '../src/parts/GetAboutDetailStringWeb/GetAboutDetailStringWeb.ts'

beforeAll(() => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: 'Test',
    },
  })
})

test('getDetailStringWeb', () => {
  const config = {
    commit: 'abc123',
    date: '',
    productName: 'Test Editor',
    version: '1.2.3',
  }
  expect(GetAboutDetailStringWeb.getDetailStringWeb(config)).toEqual(['Version: 1.2.3', 'Commit: abc123', 'Date: unknown', 'Browser: Test'])
})
