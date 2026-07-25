import { expect, test } from '@jest/globals'
import { FileSystemWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'
import { registerMockTextDocumentWorker } from './MockTextDocumentWorker.ts'

test('loads and renders file lines', async () => {
  registerMockTextDocumentWorker()
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (): Promise<string> => 'first line\nsecond line',
  })
  SyntaxHighlightingWorker.set({
    dispose: async (): Promise<void> => {},
    invoke: async (): Promise<unknown> => [
      ['first', 'Token Keyword', ' line', 'Token Text'],
      ['second line', 'Token String'],
    ],
  } as any)
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
          className: 'Editor',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: 'EditorInput',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          onInput: DomEventListenerFunctions.HandleInput,
          type: VirtualDomElements.TextArea,
          value: 'first line\nsecond line',
        },
        {
          childCount: 3,
          className: 'EditorContent',
          onClick: DomEventListenerFunctions.HandleClick,
          role: AriaRoles.None,
          type: VirtualDomElements.Div,
        },
        {
          childCount: 2,
          className: 'Gutter',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: 'LineNumber',
          type: VirtualDomElements.Span,
        },
        {
          text: 1,
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'LineNumber',
          type: VirtualDomElements.Span,
        },
        {
          text: 2,
          type: VirtualDomElements.Text,
        },
        {
          childCount: 2,
          className: 'EditorLines',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 2,
          className: 'EditorLine',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: mergeClassNames('Token', 'Keyword'),
          type: VirtualDomElements.Span,
        },
        {
          text: 'first',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: mergeClassNames('Token', 'Text'),
          type: VirtualDomElements.Span,
        },
        {
          text: ' line',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 1,
          className: 'EditorLine',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: mergeClassNames('Token', 'String'),
          type: VirtualDomElements.Span,
        },
        {
          text: 'second line',
          type: VirtualDomElements.Text,
        },
        {
          childCount: 0,
          className: 'EditorCursor',
          'data-columnIndex': '0',
          'data-rowIndex': '0',
          translate: '0px 0px',
          type: VirtualDomElements.Div,
        },
      ],
    ],
  ])

  expect(dispose(42)).toEqual([])
  TextDocumentWorker.reset()
  await SyntaxHighlightingWorker.dispose()
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
          childCount: 2,
          className: 'Editor',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          className: 'EditorInput',
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          onInput: DomEventListenerFunctions.HandleInput,
          type: VirtualDomElements.TextArea,
          value: '',
        },
        {
          childCount: 4,
          className: 'EditorContent',
          onClick: DomEventListenerFunctions.HandleClick,
          role: AriaRoles.None,
          type: VirtualDomElements.Div,
        },
        {
          childCount: 0,
          className: 'Gutter',
          type: VirtualDomElements.Div,
        },
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
        {
          childCount: 0,
          className: 'EditorCursor',
          'data-columnIndex': '0',
          'data-rowIndex': '0',
          translate: '0px 0px',
          type: VirtualDomElements.Div,
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
  registerMockTextDocumentWorker()
  let content = 'first line'
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (): Promise<string> => content,
  })
  SyntaxHighlightingWorker.set({
    dispose: async (): Promise<void> => {},
    invoke: async (_method: string, codeBlock: string): Promise<unknown> => {
      return codeBlock.split('\n').map((line) => [line, 'Token Text'])
    },
  } as any)
  create(44, 'file:///test.txt')
  await loadContent(44)
  render2(44, diff2(44))

  content = 'updated first line\nsecond line'
  await loadContent(44)

  const diffResult = diff2(44)
  const commands = render2(44, diffResult)

  expect(diffResult).toEqual([DiffType.RenderIncremental])
  expect(commands).toEqual([['Viewlet.setPatches', 44, expect.any(Array)]])
  expect(commands[0][2]).not.toEqual([])
  expect(diff2(44)).toEqual([])
  expect(dispose(44)).toEqual([])
  TextDocumentWorker.reset()
  await SyntaxHighlightingWorker.dispose()
})

test('renders line number changes incrementally', () => {
  const state = create(45)
  render2(45, diff2(45))
  EditorStates.set({
    ...state,
    lineNumbers: false,
  })

  const diffResult = diff2(45)
  const commands = render2(45, diffResult)

  expect(diffResult).toEqual([DiffType.RenderIncremental])
  expect(commands).toEqual([['Viewlet.setPatches', 45, expect.any(Array)]])
  expect(diff2(45)).toEqual([])
  expect(dispose(45)).toEqual([])
})
