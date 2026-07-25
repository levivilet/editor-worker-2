import { expect, test } from '@jest/globals'
import { detectLinks } from '../src/parts/DetectLinks/DetectLinks.ts'

test('detects links and returns their document offsets', () => {
  expect(detectLinks('Visit https://example.com\nor www.example.com')).toEqual([
    {
      length: 19,
      start: 6,
    },
    {
      length: 15,
      start: 29,
    },
  ])
})

test.each([
  // eslint-disable-next-line unicorn/prefer-https
  'http://example.com',
  'https://example.com',
  'ftp://example.com',
  'ftps://example.com',
  'file:///example.txt',
  'www.example.com',
])('detects %s', (url) => {
  expect(detectLinks(url)).toEqual([
    {
      length: url.length,
      start: 0,
    },
  ])
})

test('excludes surrounding punctuation and quotes', () => {
  const url = 'https://example.com/path'
  expect(detectLinks(`See "${url}".`)).toEqual([
    {
      length: url.length,
      start: 5,
    },
  ])
})

test('preserves balanced delimiters inside a link', () => {
  const url = 'https://example.com/path(foo)'
  expect(detectLinks(`See (${url}).`)).toEqual([
    {
      length: url.length,
      start: 5,
    },
  ])
})

test('does not detect a domain without a scheme or www prefix', () => {
  expect(detectLinks('example.com')).toEqual([])
})

test('does not detect an empty www link', () => {
  expect(detectLinks('www...')).toEqual([])
})

test('returns no links for empty text', () => {
  expect(detectLinks('')).toEqual([])
})
