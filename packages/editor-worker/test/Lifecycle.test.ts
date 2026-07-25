import { expect, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'

test('loads and renders file lines', async () => {
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (): Promise<string> => 'first line\nsecond line',
  })
  create(42, 'file:///test.txt')
  await loadContent(42)

  const diffResult = diff2(42)
  const commands = render2(42, diffResult)

  expect(diffResult).toEqual([DiffType.RenderItems])
  expect(commands).toEqual([
    [
      'Viewlet.setDom2',
      42,
      [
        {
          childCount: 2,
          className: 'EditorLines',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: 'EditorLine',
          type: VirtualDomElements.Div,
        },
        {
          text: 'first line',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'EditorLine',
          type: VirtualDomElements.Div,
        },
        {
          text: 'second line',
          type: VirtualDomElements.Text,
        },
      ],
    ],
  ])

  expect(dispose(42)).toEqual([])
})

test('rejects unknown diffs', () => {
  create(43)
  expect(() => render2(43, [999])).toThrow(new Error('Unknown editor diff: 999'))
  expect(dispose(43)).toEqual([])
})
