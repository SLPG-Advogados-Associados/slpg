// @warn: this is a cyclic dependency.
import { toDays, Duration, DurationInput } from './duration'
import { add as _add, min, isAfter, Interval as _Interval, max } from 'date-fns'

// prevent dates as numbers for interval objects.
export type Interval = {
  [P in keyof _Interval]: Exclude<_Interval[P], number>
} & { negative?: boolean }

const precisions = [
  'years',
  'months',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
] as const

const zero = {
  years: 0,
  months: 0,
  days: 1,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
}

const setters = {
  years: (date: Date, value: number) => date.setUTCFullYear(value),
  months: (date: Date, value: number) => date.setUTCMonth(value),
  days: (date: Date, value: number) => date.setUTCDate(value),
  hours: (date: Date, value: number) => date.setUTCHours(value),
  minutes: (date: Date, value: number) => date.setUTCMinutes(value),
  seconds: (date: Date, value: number) => date.setUTCSeconds(value),
  milliseconds: (date: Date, value: number) => date.setUTCMilliseconds(value),
}

const getters = {
  years: (date: Date) => date.getUTCFullYear(),
  months: (date: Date) => date.getUTCMonth(),
  days: (date: Date) => date.getUTCDate(),
  hours: (date: Date) => date.getUTCHours(),
  minutes: (date: Date) => date.getUTCMinutes(),
  seconds: (date: Date) => date.getUTCSeconds(),
  milliseconds: (date: Date) => date.getUTCMilliseconds(),
}

/**
 * Floors a Date to a given precision.
 *
 * @param precision The maximum Duration precision.
 * @param date The original Date object.
 */
const floor = (precision: typeof precisions[number], date: Date) => {
  const clone = new Date(date.getTime()) // clone, for immutability.

  for (const key of precisions.slice(precisions.indexOf(precision) + 1)) {
    setters[key](clone, zero[key])
  }

  return clone
}

/**
 * Ceils a Date to a given precision.
 *
 * @param precision The maximum Duration precision.
 * @param date The original Date object.
 */
const ceil = (precision: typeof precisions[number], date: Date) => {
  let changed = false
  const clone = new Date(date.getTime()) // clone, for immutability.

  for (const key of precisions.slice(precisions.indexOf(precision) + 1)) {
    changed = changed || getters[key](clone) > zero[key]
    setters[key](clone, zero[key])
  }

  // ceil
  if (changed) {
    setters[precision](clone, getters[precision](clone) + 1)
  }

  return clone
}

/**
 * Splits the given date interval into two intervals, based on middle point.
 */
const splitPeriod = (
  { start, end }: Interval,
  middle: Date
): [Interval, Interval] => [
  { start, end: min([end, middle]), negative: isAfter(start, middle) },
  { start: max([start, middle]), end, negative: isAfter(middle, end) },
]

/**
 * Parses an interval notation into an interval object.
 *
 * @param notation The interval notation.
 * i.e.:
 *  - 2000^2001: from 2000-01-01 until 2001-01-01
 *  - 2000-10-01^2003: from 2000-10-01 until 2003
 *  - 2000^: from 2000-01-01 until forever
 *  - ^2000: from forever until 2000
 *  - ^: always
 *  - '': error
 */
const parseInterval = (notation: string): Interval => {
  if (!notation.includes('^')) {
    throw new Error(`Invalid interval notation: "${notation}"`)
  }

  const [left, right] = notation.split('^')

  // as date strings are expected, this string based comparison is safe.
  const inverted = left && right && left > right

  const leftDate = left ? new Date(left) : null
  const rightDate = right ? new Date(right) : null

  for (const date of [leftDate, rightDate]) {
    if (date !== null && isNaN(Number(date))) {
      throw new Error(`Invalid interval notation: "${notation}"`)
    }
  }

  return {
    start: !inverted ? leftDate : rightDate,
    end: !inverted ? rightDate : leftDate,
  }
}

/**
 * Count the amount of leap days (Feb 29) between two dates.
 *
 * @param _start Starting date.
 * @param _end Ending date.
 */
const leapsBetween = (_start: Date | number, _end: Date | number) => {
  const start = _start instanceof Date ? _start : new Date(_start)
  const end = _end instanceof Date ? _end : new Date(_end)

  let days = 0
  let currYear = start.getFullYear()
  const endYear = end.getFullYear()
  const years: number[] = []

  // get all years in between.
  while (currYear <= endYear) {
    years.push(currYear++)
  }

  // add day for each leap year.
  for (const year of years) {
    const isLeap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
    const leapDay = new Date(`${year}-02-29`)

    if (isLeap && leapDay > start && leapDay < end) {
      days++
    }
  }

  return days
}

/**
 * add method override to always account for leap years.
 */
const add = (date: Date, duration: DurationInput, ignoreLeap = false) =>
  _add(date, ignoreLeap ? (duration as Duration) : { days: toDays(duration) })

export * from 'date-fns'

export { floor, ceil, splitPeriod, leapsBetween, add, parseInterval }
