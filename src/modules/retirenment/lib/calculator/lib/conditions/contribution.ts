/**
 * Contribution based conditions.
 * ------------------------------
 */

/* cspell: disable */
import { last as getLast, identity } from 'ramda'
import { add, sub } from 'date-fns'
import { between, sum, normalize, Duration } from 'duration-fns'
import { TODAY } from '../const'
import { compare, DurationProcessor, DurationInput } from '../duration'
import { floor } from '../date'

import {
  ConditionContextBase,
  ConditionResult,
  Contribution,
} from '../../types'

type ContributionsInput = {
  contributions: Contribution[]
}

/**
 * Last contribution duration condition.
 *
 * @todo consider the possibility another post but the last
 * be one that the retirement time was reached.
 *
 * @param due The due date.
 * @param duration The expected duration of the last contribution by due date.
 */
const last = (due: Date) => (expected: DurationInput) => (
  input: ContributionsInput
): ConditionResult<ConditionContextBase> => {
  const { start, end } = getLast(input.contributions)
  const reached = add(start, normalize(expected))
  return [reached <= due && (!end || reached <= end), { reached }]
}

/**
 * Full contribution duration condition.
 *
 * @param due The due date.
 * @param expected The expected combined duration of all contributions by due date.
 */
const total = (due: Date | null) => (
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
    durations.processed = normalize(sum(durations.processed, processed), start)

    // calculate reaching date, when it happens.
    if (!reached && compare.longer(durations.processed, expected, true)) {
      // remove duration from end date, add necessary expected duration.
      reached = floor('day', add(sub(end, durations.processed), expected))
    }
  }

  return [
    // when no due, simply consider current duration
    due ? reached <= due : compare.longer(durations.processed, expected, true),
    { reached, durations },
  ]
}

export { last, total }
