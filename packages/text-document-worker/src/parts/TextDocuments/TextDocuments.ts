import * as GetLines from '../GetLines/GetLines.ts'

interface TextDocument {
  readonly content: string
  readonly lines: readonly string[]
}

const documents = new Map<number, TextDocument>()

const get = (id: number): TextDocument => {
  const document = documents.get(id)
  if (!document) {
    throw new Error(`Text document not found: ${id}`)
  }
  return document
}

export const setContent = (id: number, content: string): number => {
  const lines = GetLines.getLines(content)
  documents.set(id, {
    content,
    lines,
  })
  return lines.length
}

export const getLines = (id: number, startLineIndex: number, endLineIndex: number): readonly string[] => {
  const { lines } = get(id)
  return lines.slice(startLineIndex, endLineIndex)
}

export const dispose = (id: number): void => {
  documents.delete(id)
}
