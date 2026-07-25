import { expect, test } from '@jest/globals'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'

test('renders Hello World', () => {
  create(42)

  const diffResult = diff2(42)
  const commands = render2(42, diffResult)

  expect(diffResult).toEqual([DiffType.RenderItems])
  expect(commands).toEqual([
    [
      'Viewlet.setDom2',
      42,
      [
        {
          childCount: 1,
          type: 5,
        },
        {
          text: 'Hello World',
          type: 12,
        },
      ],
    ],
  ])

  dispose(42)
})

test('rejects unknown diffs', () => {
  create(43)
  expect(() => render2(43, [999])).toThrow(new Error('Unknown editor diff: 999'))
  dispose(43)
})
