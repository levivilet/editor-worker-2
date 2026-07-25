const cacheName = 'lvce-editor-text-documents-v1'
const contentHashHeader = 'x-lvce-editor-content-hash'
const maximumCacheEntries = 100
const maximumContentSize = 100_000

const getCacheKey = (uri: string): string => {
  return `https://lvce-editor.invalid/text-document-cache/${encodeURIComponent(uri)}`
}

const getCache = async (): Promise<Cache | undefined> => {
  if (typeof caches === 'undefined') {
    return undefined
  }
  return caches.open(cacheName)
}

export const get = async (uri: string, hash: string): Promise<string | undefined> => {
  const cache = await getCache()
  if (!cache) {
    return undefined
  }
  const key = getCacheKey(uri)
  const response = await cache.match(key)
  if (!response) {
    return undefined
  }
  if (response.headers.get(contentHashHeader) !== hash) {
    await cache.delete(key)
    return undefined
  }
  const refreshedResponse = response.clone()
  const content = await response.text()
  await cache.delete(key)
  await cache.put(key, refreshedResponse)
  return content
}

export const set = async (uri: string, hash: string, content: string): Promise<void> => {
  if (new TextEncoder().encode(content).byteLength > maximumContentSize) {
    return
  }
  const cache = await getCache()
  if (!cache) {
    return
  }
  const key = getCacheKey(uri)
  const response = new Response(content, {
    headers: {
      [contentHashHeader]: hash,
      'content-type': 'text/plain; charset=utf-8',
    },
  })
  await cache.delete(key)
  await cache.put(key, response)
  const keys = await cache.keys()
  const excessEntryCount = Math.max(0, keys.length - maximumCacheEntries)
  for (const oldestKey of keys.slice(0, excessEntryCount)) {
    await cache.delete(oldestKey)
  }
}
