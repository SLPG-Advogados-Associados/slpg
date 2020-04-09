import { min as minDate, max as maxDate, Interval } from 'date-fns'

import {
  normalize as _normalize,
  toMilliseconds,
  toSeconds,
  toMinutes,
  toHours,
  toDays,
  toWeeks,
  toMonths,
  toYears,
  Duration,
  DurationInput as _DurationInput,
} from 'duration-fns'

export type DurationInput = Exclude<_DurationInput, number | string>

const durationProps: Array<keyof Duration> = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
]

const to = {
  years: toYears,
  months: toMonths,
  weeks: toWeeks,
  days: toDays,
  hours: toHours,
  minutes: toMinutes,
  seconds: toSeconds,
  milliseconds: toMilliseconds,
}

/**
 * Normalize duration for practical use on day based calculation.
 *
 * @param duration The duration input.
 */
const normalize = (duration: DurationInput, ref?: Date) => {
  const days = toDays(duration)

  return _normalize(
    {
      days: Math.floor(days),
      milliseconds: Math.floor((days % 1) * 1000 * 60 * 60 * 24),
    },
    ref
  )
}

/**
 * Gets the duration between two dates accounting for leap years.
 *
 * @param start The starting date of the interval.
 * @param end The ending date of the interval.
 */
const between = (start: number | Date, end: number | Date) => {
  const diff = Math.abs((end as number) - (start as number))
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  return normalize({ days })
}

/**
 * Multiply a given duration by the provided factor.
 *
 * @param by Factor to multiply by. I.e.: 2.2
 * @param duration The original duration.
 * @param ref Date of reference.
 */
const multiply = (by: number, duration: DurationInput, ref?: Date) =>
  normalize(
    { milliseconds: Math.round(toMilliseconds(normalize(duration)) * by) },
    ref
  )

/**
 * Retrieve the max between two durations.
 *
 * @param left Duration
 * @param right Duration
 */
const max = (left: DurationInput, right: DurationInput) =>
  toMilliseconds(left) > toMilliseconds(right) ? left : right

/**
 * Retrieve the min between two durations.
 *
 * @param left Duration
 * @param right Duration
 */
const min = (left: DurationInput, right: DurationInput) =>
  toMilliseconds(left) < toMilliseconds(right) ? left : right

/**
 * Multiply a given duration by the provided factor.
 *
 * @param duration The original duration.
 * @param precision The precision to round at
 * @param ref? Date of reference.
 */
const round = (
  duration: DurationInput,
  precision: keyof typeof to,
  ref?: Date
) =>
  normalize(
    {
      [precision]: Math.round(to[precision](duration)),
    },
    ref
  )

/**
 * Floors a duration to a given property precision.
 *
 * @param precision The maximum Duration precision.
 * @param duration The duration input object.
 *
 * i.e.: precision('years', { years: 1, months: 1, ... }) => { years: 1, months: 0, ... }
 * i.e.: precision('months', { years: 1, months: 1, ... }) => { years: 1, months: 1, ... }
 */
const precision = (precision: keyof Duration, duration: DurationInput) =>
  durationProps
    .slice(durationProps.indexOf(precision) + 1)
    .reduce((result, ignore) => ({ ...result, [ignore]: 0 }), duration)

/**
 * Split a start/end interval in two durations: before "middle" and after
 * "middle".
 *
 * @param start The starting date of the interval.
 * @param end The ending date of the interval.
 * @param middle The splitting point in time.
 */
const split = ({ start, end }: Interval, middle: Date) => [
  between(start, minDate([middle, end])),
  between(maxDate([start, middle]), end),
]

/**
 * Duration comparison helpers.
 */
const compare = {
  /**
   * Checks whether left duration is longer than right one.
   *
   * @param left Duration
   * @param right Duration
   * @param equality Whether should be true in case durations are equal.
   */
  longer: (left: DurationInput, right: DurationInput, equality = false) => {
    const lengths = [toMilliseconds(left), toMilliseconds(right)]

    return equality ? lengths[0] >= lengths[1] : lengths[0] > lengths[1]
  },

  /**
   * Checks whether left duration is shorter than right one.
   *
   * @param left Duration
   * @param right Duration
   * @param equality Whether should be true in case durations are equal.
   */
  shorter: (left: DurationInput, right: DurationInput, equality = false) =>
    compare.longer(right, left, equality),
}

export {
  multiply,
  max,
  min,
  round,
  precision,
  split,
  compare,
  between,
  normalize,
}
