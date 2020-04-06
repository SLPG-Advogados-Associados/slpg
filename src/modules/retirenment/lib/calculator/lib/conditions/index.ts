/* cspell: disable */
import { add, max } from 'date-fns'
import { normalize } from 'duration-fns'
import { DurationInput } from '../duration'
import * as contribution from './contribution'
import { Condition, ConditionContext, ConditionContextBase } from '../../types'

/**
 * Age condition factory.
 *
 * @param required The age to reach by due date, expressed in a duration object.
 */
const age = (required: DurationInput) => (input: {
  birthDate: Date
}): ConditionContextBase => ({
  reached: add(input.birthDate, normalize(required)),
})

/**
 * Helper functions to combine conditions into one.
 */
const merge = {
  /**
   * Require all to be satisfied.
   */
  all: (conditions: Condition[]) => (
    input
  ): ConditionContext<{ results: ConditionContextBase[] }> => {
    const results = conditions.map(condition => condition(input))
    const reached = max(results.map(({ reached }) => reached))

    return { reached, results }
  },
}

export {
  // condition & condition factories
  age,
  contribution,
  // helpers
  merge,
}
