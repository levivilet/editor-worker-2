import { expect, test } from '@jest/globals'
import * as AboutStrings from '../src/parts/AboutStrings/AboutStrings.ts'

test('ok', () => {
  expect(AboutStrings.ok()).toBe('Ok')
})

test('copy', () => {
  expect(AboutStrings.copy()).toBe('Copy')
})

test('version', () => {
  expect(AboutStrings.version()).toBe('Version')
})

test('commit', () => {
  expect(AboutStrings.commit()).toBe('Commit')
})

test('date', () => {
  expect(AboutStrings.date()).toBe('Date')
})

test('browser', () => {
  expect(AboutStrings.browser()).toBe('Browser')
})

test('info', () => {
  expect(AboutStrings.info()).toBe('Info')
})

test('close', () => {
  expect(AboutStrings.close()).toBe('Close')
})

test('closeDialog', () => {
  expect(AboutStrings.closeDialog()).toBe('Close Dialog')
})
