import { expect, test } from '@jest/globals'
import * as JoinLines from '../src/parts/JoinLines/JoinLines.ts'

test('joinLines', () => {
  const lines = ['a', 'b']
  expect(JoinLines.joinLines(lines)).toBe('a\nb')
})
