import { expect, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'
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

test('renders non-empty diagnostics inside a div', () => {
  const state = create(44)
  EditorStates.set({
    ...state,
    diagnostics: [
      {
        height: 16,
        type: 'error',
        width: 12,
        x: 4,
        y: 6,
      },
    ],
  })

  const commands = render2(44, diff2(44))

  expect(commands).toEqual([
    [
      'Viewlet.setDom2',
      44,
      [
        {
          childCount: 0,
          className: 'EditorLines',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: 'LayerDiagnostics',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, ClassNames.DiagnosticError),
          height: 16,
          left: 4,
          top: 6,
          type: VirtualDomElements.Div,
          width: 12,
        },
      ],
    ],
  ])

  EditorStates.set({
    ...EditorStates.get(44),
    diagnostics: [
      {
        height: 16,
        type: 'warning',
        width: 20,
        x: 8,
        y: 26,
      },
    ],
  })
  const incrementalDiff = diff2(44)
  expect(incrementalDiff).toEqual([DiffType.RenderIncremental])
  expect(render2(44, incrementalDiff)).toEqual([['Viewlet.setPatches', 44, expect.any(Array)]])

  expect(dispose(44)).toEqual([])
})

test('rejects unknown diffs', () => {
  create(43)
  expect(() => render2(43, [999])).toThrow(new Error('Unknown editor diff: 999'))
  expect(dispose(43)).toEqual([])
})

test('renders later content changes incrementally', async () => {
  let content = 'first line'
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (): Promise<string> => content,
  })
  create(44, 'file:///test.txt')
  await loadContent(44)
  render2(44, diff2(44))

  content = 'updated first line\nsecond line'
  await loadContent(44)

  const diffResult = diff2(44)
  const commands = render2(44, diffResult)

  expect(diffResult).toEqual([DiffType.RenderIncremental])
  expect(commands).toEqual([['Viewlet.setPatches', 44, expect.any(Array)]])
  expect(diff2(44)).toEqual([])
  expect(dispose(44)).toEqual([])
})
