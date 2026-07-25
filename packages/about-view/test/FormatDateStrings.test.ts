import { expect, test } from '@jest/globals'
import * as FormatDateStrings from '../src/parts/FormatDateStrings/FormatDateStrings.ts'

test('formatDateStrings - one second ago', () => {
  expect(FormatDateStrings.oneSecondAgo()).toBe('1 second ago')
})

test('formatDate - some seconds ago', () => {
  const seconds = 2
  expect(FormatDateStrings.someSecondsAgo(seconds)).toBe('2 seconds ago')
})

test('formatDate - one minute ago', () => {
  expect(FormatDateStrings.oneMinuteAgo()).toBe('1 minute ago')
})

test('formatDate - some minutes ago', () => {
  const minutes = 2
  expect(FormatDateStrings.someMinutesAgo(minutes)).toBe('2 minutes ago')
})

test('formatDate - one hour ago', () => {
  expect(FormatDateStrings.oneHourAgo()).toBe('1 hour ago')
})

test('formatDate - some hours ago', () => {
  const hours = 2
  expect(FormatDateStrings.someHoursAgo(hours)).toBe('2 hours ago')
})

test('formatDate - one day ago', () => {
  expect(FormatDateStrings.oneDayAgo()).toBe('1 day ago')
})

test('formatDate - some days ago', () => {
  const days = 2
  expect(FormatDateStrings.someDaysAgo(days)).toBe('2 days ago')
})

test('formatDate - one week ago', () => {
  expect(FormatDateStrings.oneWeekAgo()).toBe('1 week ago')
})

test('formatDate - some weeks ago', () => {
  const weeks = 2
  expect(FormatDateStrings.someWeeksAgo(weeks)).toBe('2 weeks ago')
})

test('formatDate - one year ago', () => {
  expect(FormatDateStrings.oneYearAgo()).toBe('1 year ago')
})

test('formatDate - some years ago', () => {
  const years = 2
  expect(FormatDateStrings.someYearsAgo(years)).toBe('2 years ago')
})

test('formatDate - in one second', () => {
  expect(FormatDateStrings.inOneSecond()).toBe('in 1 second')
})

test('formatDate - in some seconds', () => {
  const seconds = 2
  expect(FormatDateStrings.inSomeSeconds(seconds)).toBe('in 2 seconds')
})

test('formatDate - in one minute', () => {
  expect(FormatDateStrings.inOneMinute()).toBe('in 1 minute')
})

test('formatDate - in some minutes', () => {
  const minutes = 2
  expect(FormatDateStrings.inSomeMinutes(minutes)).toBe('in 2 minutes')
})

test('formatDate - in one hour', () => {
  expect(FormatDateStrings.inOneHour()).toBe('in 1 hour')
})

test('formatDate - in some hours', () => {
  const hours = 2
  expect(FormatDateStrings.inSomeHours(hours)).toBe('in 2 hours')
})

test('formatDate - in one day', () => {
  expect(FormatDateStrings.inOneDay()).toBe('in 1 day')
})

test('formatDate - in some days', () => {
  const days = 2
  expect(FormatDateStrings.inSomeDays(days)).toBe('in 2 days')
})

test('formatDate - in one week', () => {
  expect(FormatDateStrings.inOneWeek()).toBe('in 1 week')
})

test('formatDate - in some weeks', () => {
  const weeks = 2
  expect(FormatDateStrings.inSomeWeeks(weeks)).toBe('in 2 weeks')
})

test('formatDate - in one month', () => {
  expect(FormatDateStrings.inOneMonth()).toBe('in 1 month')
})

test('formatDate - in some months', () => {
  const months = 2
  expect(FormatDateStrings.inSomeMonths(months)).toBe('in 2 months')
})

test('formatDate - in one year', () => {
  expect(FormatDateStrings.inOneYear()).toBe('in 1 year')
})

test('formatDate - in some year', () => {
  const years = 2
  expect(FormatDateStrings.inSomeYears(years)).toBe('in 2 years')
})
