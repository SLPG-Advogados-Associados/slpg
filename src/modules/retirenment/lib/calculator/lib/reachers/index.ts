/* cspell: disable */
import { add } from '../date'
import { DurationInput } from '../duration'
import { Reacher, CalculatorInput } from '../../types'
import * as contribution from './contribution'

/**
 * Age reacher factory.
 *
 * @param duration Age of reaching.
 * @param input Person input.
 */
const age = (
  duration: DurationInput | ((input: CalculatorInput) => DurationInput)
): Reacher => input => [
  add(
    input.birthDate,
    typeof duration === 'function' ? duration(input) : duration,
    true
  ),
  { reachable: false },
]

export { age, contribution }
