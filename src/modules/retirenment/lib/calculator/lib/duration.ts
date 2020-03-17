import { normalize, DurationInput, toMilliseconds } from 'duration-fns'
import { TODAY } from './const'

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

export { apply, multiply }
