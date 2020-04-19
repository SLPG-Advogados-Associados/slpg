/* cspell: disable */
import { add } from '../date'
import { DurationInput, between } from '../duration'
import { Reacher, CalculatorInput } from '../../types'
import * as contribution from './contribution'

/**
 * Age reacher factory.
 *
 * @param duration Age of reaching.
 * @param input Person input.
 */
const age = (
  duration: DurationInput | ((input: CalculatorInput) => DurationInput),
  config: { due?: Date } = {}
): Reacher => input => [
  add(
    input.birthDate,
    typeof duration === 'function' ? duration(input) : duration,
    true
  ),
  {
    reachable: false,
    byDue: config.due ? between(input.birthDate, config.due) : null,
  },
]

export { age, contribution }
