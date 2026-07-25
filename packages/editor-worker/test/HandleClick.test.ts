import { expect, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { handleClick } from '../src/parts/HandleClick/HandleClick.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'
import { registerMockTextDocumentWorker } from './MockTextDocumentWorker.ts'

test('updates the cursor position for an editor click', async () => {
  const textDocumentRpc = registerMockTextDocumentWorker()
  using _textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 4
    },
  })
  const state = create(1, 'file:///test.txt', 100, 50, 300, 200)
  EditorStates.set({
    ...state,
    lines: ['first line', 'second line'],
  })
  await textDocumentRpc.invoke('TextDocument.setContent', 1, 'first line\nsecond line')
  render2(1, diff2(1))

  await handleClick(1, 145, 75)

  expect(EditorStates.get(1).selections).toEqual(new Uint32Array([1, 4, 1, 4]))
  const diffResult = diff2(1)
  expect(diffResult).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
  expect(render2(1, diffResult)).toEqual([
    ['Viewlet.setPatches', 1, expect.any(Array)],
    [
      'Viewlet.setCss',
      1,
      `[class~="EditorCursor-1-0"] {
  translate: 36px 20px;
}`,
    ],
  ])
  dispose(1)
  TextDocumentWorker.reset()
})

test('selects a word for an editor double click', async () => {
  const textDocumentRpc = registerMockTextDocumentWorker()
  using _textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 6
    },
  })
  const state = create(2, 'file:///test.txt', 100, 50, 300, 200)
  EditorStates.set({
    ...state,
    lines: ['first line', 'second line'],
  })
  await textDocumentRpc.invoke('TextDocument.setContent', 2, 'first line\nsecond line')

  await handleClick(2, 154, 75, 2)

  expect(EditorStates.get(2).selections).toEqual(new Uint32Array([1, 0, 1, 6]))
  expect(textDocumentRpc.invocations).toEqual([
    ['TextDocument.setContent', 2, 'first line\nsecond line'],
    ['TextDocument.setSelections', 2, [1, 0, 1, 6]],
    ['TextDocument.getLines', 2, 0, 2],
  ])
  dispose(2)
  TextDocumentWorker.reset()
})

test('keeps the selection collapsed when double clicking an empty editor', async () => {
  const textDocumentRpc = registerMockTextDocumentWorker()
  create(3)
  await textDocumentRpc.invoke('TextDocument.setContent', 3, '')

  await handleClick(3, 0, 0, 2)

  expect(EditorStates.get(3).selections).toEqual(new Uint32Array([0, 0, 0, 0]))
  dispose(3)
  TextDocumentWorker.reset()
})
