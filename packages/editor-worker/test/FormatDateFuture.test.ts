import { expect, test } from '@jest/globals'
import * as FormatDateFuture from '../src/parts/FormatDateFuture/FormatDateFuture.ts'

test('formatDateFuture - in 1 second', () => {
  const seconds = 1
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 second')
})

test('formatDateFuture - in 2 seconds', () => {
  const seconds = 2
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 seconds')
})

test('formatDateFuture - in 1 minute', () => {
  const seconds = 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 minute')
})

test('formatDateFuture - in 2 minutes', () => {
  const seconds = 120
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 minutes')
})

test('formatDateFuture - in 1 hour', () => {
  const seconds = 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 hour')
})

test('formatDateFuture - in 2 hours', () => {
  const seconds = 2 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 hours')
})

test('formatDateFuture - in 1 day', () => {
  const seconds = 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 day')
})

test('formatDateFuture - in 2 days', () => {
  const seconds = 2 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 days')
})

test('formatDateFuture - in 1 week', () => {
  const seconds = 7 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 week')
})

test('formatDateFuture - in 2 weeks', () => {
  const seconds = 2 * 7 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 weeks')
})

test('formatDateFuture - in 1 month', () => {
  const seconds = 30 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 month')
})

test('formatDateFuture - in 2 months', () => {
  const seconds = 2 * 30 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 months')
})

test('formatDateFuture - in 1 year', () => {
  const seconds = 365 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 1 year')
})

test('formatDateFuture - in 2 years', () => {
  const seconds = 2 * 365 * 24 * 60 * 60
  expect(FormatDateFuture.formatDateFuture(seconds)).toBe('in 2 years')
})
