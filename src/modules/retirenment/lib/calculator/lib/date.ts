import { min, isAfter, Interval as _Interval, max } from 'date-fns'

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

/**
 * Floors a Date to a given precision.
 *
 * @param precision The maximum Duration precision.
 * @param date The original Date object.
 */
const floor = (precision, date: Date) => {
  const result = new Date(date.getTime()) // clone, for immutability.

  for (const key of precisions.slice(precisions.indexOf(precision) + 1)) {
    // if (key === 'years') result.setUTCFullYear(0) // never happens :)
    if (key === 'months') result.setUTCMonth(0)
    if (key === 'days') result.setUTCDate(1)
    if (key === 'hours') result.setUTCHours(0)
    if (key === 'minutes') result.setUTCMinutes(0)
    if (key === 'seconds') result.setUTCSeconds(0)
    if (key === 'milliseconds') result.setUTCMilliseconds(0)
  }

  return result
}

/**
 * Ceils a Date to a given precision.
 *
 * @param precision The maximum Duration precision.
 * @param date The original Date object.
 */
const ceil = (precision, date: Date) => {
  const result = new Date(date.getTime()) // clone, for immutability.

  for (const key of precisions.slice(precisions.indexOf(precision) + 1)) {
    // if (key === 'years') result.setUTCFullYear(0) // never happens :)
    if (key === 'months') result.setUTCMonth(0)
    if (key === 'days') result.setUTCDate(1)
    if (key === 'hours') result.setUTCHours(0)
    if (key === 'minutes') result.setUTCMinutes(0)
    if (key === 'seconds') result.setUTCSeconds(0)
    if (key === 'milliseconds') result.setUTCMilliseconds(0)
  }

  if (precision === 'years') result.setUTCFullYear(result.getUTCFullYear() + 1)
  if (precision === 'months') result.setUTCMonth(result.getUTCMonth() + 1)
  if (precision === 'days') result.setUTCDate(result.getUTCDate() + 1)
  if (precision === 'hours') result.setUTCHours(result.getUTCHours() + 1)
  if (precision === 'minutes') result.setUTCMinutes(result.getUTCMinutes() + 1)
  if (precision === 'seconds') result.setUTCSeconds(result.getUTCSeconds() + 1)

  return result
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

export { floor, ceil, splitPeriod, leapsBetween }
