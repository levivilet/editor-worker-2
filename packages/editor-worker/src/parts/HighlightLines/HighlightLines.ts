import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

export const highlightLines = async (
  content: string,
  languageId: string,
  tokenizePath: string,
  lines: readonly string[],
): Promise<readonly (readonly string[])[]> => {
  try {
    const result = await SyntaxHighlightingWorker.invoke('Tokenizer.tokenizeCodeBlock', content, languageId, tokenizePath)
    if (Array.isArray(result)) {
      return result as readonly (readonly string[])[]
    }
  } catch {
    return lines.map((line) => [line, 'Token Text'])
  }
  return lines.map((line) => [line, 'Token Text'])
}
