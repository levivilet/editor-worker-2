import { expect, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getClickPosition } from '../src/parts/GetClickPosition/GetClickPosition.ts'

const createState = (): EditorState => ({
  columnWidth: 9,
  diagnostics: [],
  findWidgetVisible: false,
  height: 200,
  languageId: 'plaintext',
  lineCount: 3,
  lineNumbers: true,
  lines: ['first line', 'second', ''],
  longestLineWidth: 90,
  maxLineY: 3,
  minLineY: 0,
  rowHeight: 20,
  scrollBarWidth: 0,
  selections: new Uint32Array([0, 0, 0, 0]),
  tokenizedLines: [],
  tokenizePath: '',
  uid: 1,
  uri: 'file:///test.txt',
  width: 300,
  x: 100,
  y: 50,
})

test('asks the text measurement worker for the closest cursor position', async () => {
  using textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 4
    },
  })

  await expect(getClickPosition(createState(), 145, 75)).resolves.toEqual({
    columnIndex: 4,
    rowIndex: 1,
  })
  expect(textMeasurementRpc.invocations).toEqual([['TextMeasurement.getPosition', 'second', 400, 15, 'Fira Code', 0.5, true, 9, 2, 45]])
})

test('clamps measured positions to the line boundaries', async () => {
  using _textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 100
    },
  })

  await expect(getClickPosition(createState(), 1000, 75)).resolves.toEqual({
    columnIndex: 6,
    rowIndex: 1,
  })
})

test('clamps coordinates before measuring text', async () => {
  using textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 0
    },
  })

  await expect(getClickPosition(createState(), 0, 0)).resolves.toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
  expect(textMeasurementRpc.invocations).toEqual([['TextMeasurement.getPosition', 'first line', 400, 15, 'Fira Code', 0.5, true, 9, 2, 0]])
})

test('clamps clicks below the document to the last line', async () => {
  using _textMeasurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition'(): number {
      return 0
    },
  })

  await expect(getClickPosition(createState(), 1000, 1000)).resolves.toEqual({
    columnIndex: 0,
    rowIndex: 2,
  })
})

test('returns the document start before content is loaded', async () => {
  await expect(getClickPosition({ ...createState(), lines: [] }, 145, 75)).resolves.toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
})
