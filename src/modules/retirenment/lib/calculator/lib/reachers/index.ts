/* cspell: disable */
import { add } from '../date'
import { DurationInput } from '../duration'
import { Reacher } from '../../types'
import * as contribution from './contribution'

type Input = { birthDate: Date }

/**
 * Age reacher factory.
 *
 * @param duration Age of reaching.
 * @param input Person input.
 */
const age = (
  duration: DurationInput | ((input: Input) => DurationInput)
): Reacher<Input> => input => [
  add(
    input.birthDate,
    typeof duration === 'function' ? duration(input) : duration,
    true
  ),
]

export { age, contribution }
