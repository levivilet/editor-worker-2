import { afterEach, beforeEach, expect, test } from '@jest/globals'
import * as TextDocumentCache from '../src/parts/TextDocumentCache/TextDocumentCache.ts'

class TestCache {
  readonly entries = new Map<string, Response>()

  async delete(request: RequestInfo | URL): Promise<boolean> {
    return this.entries.delete(this.toUrl(request))
  }

  async keys(): Promise<readonly Request[]> {
    return [...this.entries.keys()].map((key) => new Request(key))
  }

  async match(request: RequestInfo | URL): Promise<Response | undefined> {
    return this.entries.get(this.toUrl(request))?.clone()
  }

  async put(request: RequestInfo | URL, response: Response): Promise<void> {
    this.entries.set(this.toUrl(request), response.clone())
  }

  private toUrl(request: RequestInfo | URL): string {
    if (request instanceof Request) {
      return request.url
    }
    return new URL(request.toString()).href
  }
}

const testCache = new TestCache()

beforeEach(() => {
  testCache.entries.clear()
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: {
      open: async (): Promise<TestCache> => testCache,
    },
  })
})

afterEach(() => {
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: undefined,
  })
})

test('returns cached content when the hash matches', async () => {
  await TextDocumentCache.set('file:///test.txt', 'hash-1', 'cached content')

  await expect(TextDocumentCache.get('file:///test.txt', 'hash-1')).resolves.toBe('cached content')
})

test('removes stale content when the hash does not match', async () => {
  await TextDocumentCache.set('file:///test.txt', 'hash-1', 'stale content')

  await expect(TextDocumentCache.get('file:///test.txt', 'hash-2')).resolves.toBeUndefined()
  expect(testCache.entries.size).toBe(0)
})

test('returns undefined for a cache miss', async () => {
  await expect(TextDocumentCache.get('file:///missing.txt', 'hash-1')).resolves.toBeUndefined()
})

test('does not cache content larger than 100 kB', async () => {
  await TextDocumentCache.set('file:///large.txt', 'hash-1', 'x'.repeat(100_001))

  expect(testCache.entries.size).toBe(0)
})

test('measures the cache limit in encoded bytes', async () => {
  await TextDocumentCache.set('file:///large-unicode.txt', 'hash-1', 'é'.repeat(50_001))

  expect(testCache.entries.size).toBe(0)
})

test('keeps content that is exactly 100 kB', async () => {
  await TextDocumentCache.set('file:///limit.txt', 'hash-1', 'x'.repeat(100_000))

  await expect(TextDocumentCache.get('file:///limit.txt', 'hash-1')).resolves.toBe('x'.repeat(100_000))
})

test('evicts the least recently used entry above 100 entries', async () => {
  for (let index = 0; index < 100; index++) {
    await TextDocumentCache.set(`file:///${index}.txt`, `hash-${index}`, `${index}`)
  }
  await TextDocumentCache.get('file:///0.txt', 'hash-0')
  await TextDocumentCache.set('file:///100.txt', 'hash-100', '100')

  await expect(TextDocumentCache.get('file:///0.txt', 'hash-0')).resolves.toBe('0')
  await expect(TextDocumentCache.get('file:///1.txt', 'hash-1')).resolves.toBeUndefined()
  await expect(TextDocumentCache.get('file:///100.txt', 'hash-100')).resolves.toBe('100')
  expect(testCache.entries.size).toBe(100)
})

test('does nothing when Cache Storage is unavailable', async () => {
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: undefined,
  })

  await expect(TextDocumentCache.get('file:///test.txt', 'hash-1')).resolves.toBeUndefined()
  await expect(TextDocumentCache.set('file:///test.txt', 'hash-1', 'content')).resolves.toBeUndefined()
})
