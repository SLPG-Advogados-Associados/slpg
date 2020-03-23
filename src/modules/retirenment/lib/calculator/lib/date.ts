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
 * Splits the given date interval into two intervals, based on middle point.
 */
const splitPeriod = ({ start, end }: Interval, middle: Date) => [
  { start, end: min([end, middle]), negative: isAfter(start, middle) },
  { start: max([start, middle]), end, negative: isAfter(middle, end) },
]

export { floor, splitPeriod }
