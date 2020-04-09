/* cspell: disable */
import { normalize } from 'duration-fns'
import { add, max } from '../date'
import { DurationInput } from '../duration'
import { Reacher } from '../../types'
import * as contribution from './contribution'

/**
 * Age reacher factory.
 *
 * @param duration Age of reaching.
 * @param input Person input.
 */
const age = (duration: DurationInput): Reacher<{ birthDate: Date }> => {
  // pre-calc normalization
  const normalized = normalize(duration)
  return input => [add(input.birthDate, normalized)]
}

/**
 * Helper functions to combine reachers into one.
 */
const merge = {
  /**
   * Reaches when last reaches.
   */
  all: (reachers: Reacher[]): Reacher => input => {
    const results = reachers.map(reacher => reacher(input))
    const reached = max(results.map(([reached]) => reached))

    return [reached, { results }]
  },
}

export { age, merge, contribution }
