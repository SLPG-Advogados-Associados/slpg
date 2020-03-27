/* cspell: disable */
import { add, max } from 'date-fns'
import { normalize } from 'duration-fns'
import { DurationInput } from '../duration'
import * as contribution from './contribution'
import { Condition, ConditionContextBase, ConditionResult } from '../../types'

/**
 * Age condition factory.
 *
 * @param due The due date.
 * @param duration The age to reach by due date, expressed in a duration object.
 */
const age = (due: Date) => (age: DurationInput) => (input: {
  birthDate: Date
}): ConditionResult<ConditionContextBase> => {
  const reached = add(input.birthDate, normalize(age))
  return [reached <= due, { reached }]
}

/**
 * Helper functions to combine conditions into one.
 */
const merge = {
  /**
   * Require all to be satisfied.
   */
  all: (conditions: Condition[]) => (
    input
  ): ConditionResult<{ reached: Date; results: ConditionResult[] }> => {
    const results = conditions.map(condition => condition(input))

    const satisfied = results.every(([satisfied]) => satisfied)
    const reached = max(results.map(([, { reached }]) => reached))

    return [satisfied, { reached, results }]
  },
}

export {
  // condition & condition factories
  age,
  contribution,
  // helpers
  merge,
}
