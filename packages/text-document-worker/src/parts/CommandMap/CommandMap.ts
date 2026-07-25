import * as TextDocuments from '../TextDocuments/TextDocuments.ts'

export const commandMap = {
  'TextDocument.dispose': TextDocuments.dispose,
  'TextDocument.getLines': TextDocuments.getLines,
  'TextDocument.setContent': TextDocuments.setContent,
}
