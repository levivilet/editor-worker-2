import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('contains text document commands', () => {
  expect(Object.keys(commandMap)).toEqual(['TextDocument.dispose', 'TextDocument.getLines', 'TextDocument.setContent'])
})
