import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('contains only the minimal editor lifecycle', () => {
  expect(Object.keys(commandMap)).toEqual(['Editor.create', 'Editor.diff2', 'Editor.dispose', 'Editor.render2'])
})
