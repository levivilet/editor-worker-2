import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as EditorMetrics from '../EditorMetrics/EditorMetrics.ts'

interface EditorPosition {
  readonly columnIndex: number
  readonly rowIndex: number
}

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum)
}

export const getClickPosition = async (state: EditorState, eventX: number, eventY: number): Promise<EditorPosition> => {
  const { columnWidth, lines, rowHeight, x, y } = state
  if (lines.length === 0) {
    return {
      columnIndex: 0,
      rowIndex: 0,
    }
  }
  const rowIndex = clamp(Math.floor((eventY - y) / rowHeight), 0, lines.length - 1)
  const line = lines[rowIndex]
  const offsetX = Math.max(eventX - x, 0)
  const measuredColumnIndex = await TextMeasurementWorker.invoke(
    'TextMeasurement.getPosition',
    line,
    EditorMetrics.FontWeight,
    EditorMetrics.FontSize,
    EditorMetrics.FontFamily,
    EditorMetrics.LetterSpacing,
    EditorMetrics.IsMonospaceFont,
    columnWidth,
    EditorMetrics.TabSize,
    offsetX,
  )
  const columnIndex = clamp(measuredColumnIndex, 0, line.length)
  return {
    columnIndex,
    rowIndex,
  }
}
