import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as TextDocumentCache from '../TextDocumentCache/TextDocumentCache.ts'

interface Cache {
  readonly get: typeof TextDocumentCache.get
  readonly set: typeof TextDocumentCache.set
}

export const getFileContent = async (uri: string, useCache: boolean, cache: Cache = TextDocumentCache): Promise<string> => {
  if (!useCache) {
    return FileSystemWorker.readFile(uri)
  }
  let hash: string
  try {
    hash = await FileSystemWorker.invoke('FileSystem.getFileHash', uri)
  } catch {
    return FileSystemWorker.readFile(uri)
  }
  try {
    const cachedContent = await cache.get(uri, hash)
    if (cachedContent !== undefined) {
      return cachedContent
    }
  } catch {
    // Cache Storage is an optional optimization.
  }
  const content = await FileSystemWorker.readFile(uri)
  try {
    await cache.set(uri, hash, content)
  } catch {
    // Cache Storage is an optional optimization.
  }
  return content
}
