import {
  normalize,
  toMilliseconds,
  Duration,
  DurationInput,
} from 'duration-fns'

import { ServiceKind, Contribution } from '../types'
import { TODAY, NO_DURATION } from './const'

/**
 * Apply a given function to the provided duration.
 *
 * @param func Function to alter duration.
 * @param duration The original duration.
 * @param ref Date of reference, if needed.
 */
const apply = (
  func: (DurationInput) => DurationInput,
  duration: DurationInput,
  ref: Date = TODAY
) => normalize(func(normalize(duration)), ref)

/**
 * Multiply a given duration by the provided factor.
 *
 * @param by Factor to multiply by. I.e.: 2.2
 * @param duration The original duration.
 * @param ref Date of reference.
 */
const multiply = (by: number, duration: DurationInput, ref: Date) =>
  apply(
    input =>
      normalize(
        { milliseconds: Math.floor(toMilliseconds(normalize(input)) * by) },
        ref
      ),
    duration,
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
 * A function that processes Duration -> Duration for altering purposes.
 */
export type DurationProcessor<Context = {}> = (
  duration: Duration,
  context: Context
) => DurationInput

/**
 * Reusable filters to be used as processors.
 *
 * Duration -> Duration functions/factories that retrieve NO_DURATION on failure.
 */
const filters = {
  /**
   * Filter out any contribution time related to different service kinds.
   *
   * @param kind The required service kind.
   */
  serviceKind: (
    kind: ServiceKind
  ): DurationProcessor<{ contribution: Contribution }> => (
    duration,
    { contribution: { service } }
  ) => (service.kind === kind ? duration : NO_DURATION),
}

export { apply, multiply, max, min, filters }
