import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('is empty', () => {
  expect(commandMap).toEqual({})
})
