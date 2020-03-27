/* cspell: disable */
import { last, identity } from 'ramda'
import { add, max, sub } from 'date-fns'
import { between, sum, normalize, Duration } from 'duration-fns'
import { TODAY } from '../const'
import { compare, DurationProcessor, DurationInput } from '../duration'
import { floor } from '../date'

import {
  Condition,
  ConditionContextBase,
  ConditionResult,
  Contribution,
} from '../../types'

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

type ContributionsInput = {
  contributions: Contribution[]
}

/**
 * Condition group for contribution related conditions.
 */
const contribution = {
  /**
   * Last contribution duration condition.
   *
   * @todo consider the possibility another post but the last
   * be one that the retirement time was reached.
   *
   * @param due The due date.
   * @param duration The expected duration of the last contribution by due date.
   */
  last: (due: Date) => (expected: DurationInput) => (
    input: ContributionsInput
  ): ConditionResult<ConditionContextBase> => {
    const { start, end } = last(input.contributions)
    const reached = add(start, normalize(expected))
    return [reached <= due && (!end || reached <= end), { reached }]
  },

  /**
   * Full contribution duration condition.
   *
   * @param due The due date.
   * @param expected The expected combined duration of all contributions by due date.
   */
  total: (due: Date | null) => (
    _expected: DurationInput,
    process: DurationProcessor<{
      due: Date
      expected: DurationInput
      contribution: Contribution
    }> = identity
  ) => (
    input: ContributionsInput
  ): ConditionResult<
    ConditionContextBase & {
      durations: { real: Duration; processed: Duration }
    }
  > => {
    let reached: Date
    const expected = normalize(_expected)

    const durations = { real: {}, processed: {} } as {
      real: Duration
      processed: Duration
    }

    for (const contribution of input.contributions) {
      // processing context.
      const context = { due, expected, contribution }

      const { start, end = TODAY } = contribution

      // plain isolated duration addition.
      const real = between(start, end)
      // processed duration, with possible manipulation.
      const processed = process(real, context)

      // sum-up real time-based duration so far.
      durations.real = normalize(sum(durations.real, real), start)

      // sum-up processed calculation purposed duration so far.
      durations.processed = normalize(
        sum(durations.processed, processed),
        start
      )

      // calculate reaching date, when it happens.
      if (!reached && compare.longer(durations.processed, expected, true)) {
        // remove duration from end date, add necessary expected duration.
        reached = floor('day', add(sub(end, durations.processed), expected))
      }
    }

    return [
      // when no due, simply consider current duration
      due
        ? reached <= due
        : compare.longer(durations.processed, expected, true),
      { reached, durations },
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