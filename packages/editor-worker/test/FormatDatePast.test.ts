import { expect, test } from '@jest/globals'
import * as FormatDatePast from '../src/parts/FormatDatePast/FormatDatePast.ts'

test('formatDatePast - 1 second ago', () => {
  const seconds = 1
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 second ago')
})

test('formatDatePast - 2 seconds ago', () => {
  const seconds = 2
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 seconds ago')
})

test('formatDatePast - 1 minute ago', () => {
  const seconds = 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 minute ago')
})

test('formatDatePast - 2 minutes ago', () => {
  const seconds = 120
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 minutes ago')
})

test('formatDatePast - 1 hour ago', () => {
  const seconds = 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 hour ago')
})

test('formatDatePast - 2 hours ago', () => {
  const seconds = 2 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 hours ago')
})

test('formatDatePast - 1 day ago', () => {
  const seconds = 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 day ago')
})

test('formatDatePast - 2 days ago', () => {
  const seconds = 2 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 days ago')
})

test('formatDatePast - 1 week ago', () => {
  const seconds = 7 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 week ago')
})

test('formatDatePast - 2 weeks ago', () => {
  const seconds = 2 * 7 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 weeks ago')
})

test('formatDatePast - 1 month ago', () => {
  const seconds = 30 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 month ago')
})

test('formatDatePast - 2 months ago', () => {
  const seconds = 2 * 30 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 months ago')
})

test('formatDatePast - 1 year ago', () => {
  const seconds = 365 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('1 year ago')
})

test('formatDatePast - 2 years ago', () => {
  const seconds = 2 * 365 * 24 * 60 * 60
  expect(FormatDatePast.formatDatePast(seconds)).toBe('2 years ago')
})
