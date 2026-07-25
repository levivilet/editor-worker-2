import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'

export const copy = async (lines: readonly string[]): Promise<void> => {
  const message = JoinLines.joinLines(lines)
  await ClipBoard.writeText(message)
}
