import type { Link } from '../Link/Link.ts'

const urlPattern = /(?:https?|ftps?|file):\/\/[^\s"']+|www\.[^\s"']+/g

const hasSchemePattern = /^(?:https?|ftps?|file):\/\//

const hasWwwPattern = /^www\./

const trailingSentencePunctuation = '.,;:!?'

const openingDelimiterMap: Readonly<Record<string, string>> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const hasUnmatchedClosingDelimiter = (url: string, closingDelimiter: string): boolean => {
  const openingDelimiter = openingDelimiterMap[closingDelimiter]
  let balance = 0
  for (const character of url) {
    if (character === openingDelimiter) {
      balance++
    } else if (character === closingDelimiter) {
      balance--
    }
  }
  return balance < 0
}

const trimTrailingPunctuation = (url: string): string => {
  let end = url.length
  while (end > 0) {
    const character = url[end - 1]
    if (trailingSentencePunctuation.includes(character)) {
      end--
      continue
    }
    if (character in openingDelimiterMap && hasUnmatchedClosingDelimiter(url.slice(0, end), character)) {
      end--
      continue
    }
    break
  }
  return url.slice(0, end)
}

export const detectLinks = (text: string): readonly Link[] => {
  const links: Link[] = []
  for (const match of text.matchAll(urlPattern)) {
    const url = trimTrailingPunctuation(match[0])
    if (!hasSchemePattern.test(url) && !hasWwwPattern.test(url)) {
      continue
    }
    links.push({
      length: url.length,
      start: match.index,
    })
  }
  return links
}
