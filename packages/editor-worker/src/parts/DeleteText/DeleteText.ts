import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

type Direction = 'left' | 'right'
type Unit = 'character' | 'word'

export const deleteText = async (uid: number, direction: Direction, unit: Unit): Promise<void> => {
  const suffix = `${unit[0].toUpperCase()}${unit.slice(1)}${direction[0].toUpperCase()}${direction.slice(1)}`
  await RunTextDocumentCommand.runTextDocumentCommand(uid, `TextDocument.delete${suffix}`)
}
