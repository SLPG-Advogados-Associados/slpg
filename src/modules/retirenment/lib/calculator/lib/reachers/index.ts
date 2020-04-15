/* cspell: disable */
import { add } from '../date'
import { DurationInput } from '../duration'
import { Reacher } from '../../types'
import * as contribution from './contribution'

/**
 * Age reacher factory.
 *
 * @param duration Age of reaching.
 * @param input Person input.
 */
const age = (
  duration: DurationInput
): Reacher<{ birthDate: Date }> => input => [
  add(input.birthDate, duration, true),
]

export { age, contribution }
