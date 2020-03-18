/* cspell: disable */
import { last, identity } from 'ramda'
import { add, max, sub } from 'date-fns'
import { between, sum, normalize, Duration } from 'duration-fns'
import { TODAY } from './const'
import { DurationProcessor } from './duration'

import {
  Condition,
  ConditionContextBase,
  ConditionResult,
  Contribution,
} from '../types'

/**
 * Age condition factory.
 * @param due The due date.
 * @param years The age to reach by due date.
 */
const age = (due: Date) => (years: number) => (input: {
  birthDate: Date
}): ConditionResult<ConditionContextBase> => {
  const reached = add(input.birthDate, { years })
  return [reached <= due, { reached }]
}

type ContributionsInput = {
  contributions: Contribution[]
}

/**
 * Condition group for contribution related conditions.
 */
const contribution = {
  /**
   * Last contribution min years condition.
   *
   * @todo consider the possibility another post but the last
   * be one that the retirement time was reached.
   *
   * @param due The due date.
   * @param years The years the last contribution must have by due date.
   */
  last: (due: Date) => (years: number) => (
    input: ContributionsInput
  ): ConditionResult<ConditionContextBase> => {
    const { start, end } = last(input.contributions)
    const reached = add(start, { years })
    return [reached <= due && (!end || reached <= end), { reached }]
  },

  /**
   * Full contribution min years condition.
   * @param due The due date.
   * @param years The combined duration years contributions must have by due date.
   */
  total: (due: Date | null) => (
    years: number,
    process: DurationProcessor<{
      due: Date
      years: number
      contribution: Contribution
    }> = identity
  ) => (
    input: ContributionsInput
  ): ConditionResult<ConditionContextBase & { duration: Duration }> => {
    let reached: Date
    let duration = {} as Duration

    for (const contribution of input.contributions) {
      const { start, end = TODAY } = contribution

      // processing context.
      const context = { due, years, contribution }

      // allow processing duration, for exception based manipulation.
      const processed = process(between(start, end), context)

      // sum up for the whole duration
      duration = normalize(sum(duration, processed), start)

      // calculate reaching date, when it happens.
      if (!reached && duration.years >= years) {
        // remove duration from end date, add necessary years.
        // @todo: is this correct?
        reached = add(sub(end, duration), { years })
      }
    }

    return [
      // when no due, simply count current duration
      due ? reached <= due : duration.years >= years,
      { reached, duration },
    ]
  },
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
