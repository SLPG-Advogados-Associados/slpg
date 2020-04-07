/**
 * Contribution based conditions.
 * ------------------------------
 */

/* cspell: disable */
import { last as getLast, identity } from 'ramda'
import { add, sub } from 'date-fns'
import { between, sum, normalize, Duration } from 'duration-fns'
import { floor } from '../date'
import { TODAY, NEVER } from '../const'
import { compare, DurationProcessor, DurationInput } from '../duration'
import { Contribution, Reacher } from '../../types'

type ContributionsInput = {
  contributions: Contribution[]
}

/**
 * Last contribution duration reacher.
 *
 * @todo consider the possibility that another post before the last
 * be the one that the retirement time was reached first.
 *
 * @param duration The expected duration of the last contribution by due date.
 */
const last = (
  expected: DurationInput
): Reacher<ContributionsInput> => input => {
  const { start, end } = getLast(input.contributions)
  const reached = add(start, normalize(expected))

  return [!end || reached <= end ? reached : NEVER]
}

/**
 * Full contribution duration reacher.
 *
 * @param due The due date.
 * @param expected The expected combined duration of all contributions by due date.
 */
const total = (
  _expected: DurationInput,
  process: DurationProcessor<{
    expected: DurationInput
    contribution: Contribution
  }> = identity
): Reacher<
  ContributionsInput,
  { durations: { real: Duration; processed: Duration } }
> => input => {
  let reached: Date
  const expected = normalize(_expected)

  const durations = { real: {}, processed: {} } as {
    real: Duration
    processed: Duration
  }

  for (const contribution of input.contributions) {
    // processing context.
    const context = { expected, contribution }

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

  return [reached || NEVER, { durations }]

  // return [
  //   // when no due, simply consider current duration
  //   due ? reached <= due : compare.longer(durations.processed, expected, true),
  //   { reached, durations },
  // ]
}

export { last, total }
