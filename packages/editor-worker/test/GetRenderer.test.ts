import { expect, test } from '@jest/globals'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'

test('unknown', () => {
  expect(() => GetRenderer.getRenderer(0)).toThrow(new Error('unknown renderer'))
})
