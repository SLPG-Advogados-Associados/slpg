import { normalize } from 'duration-fns'

import { CalculatorInput } from '../../../types'
import { ceil, contains } from '../../date'
import { TODAY, NO_DURATION, NEVER } from '../../const'
import { RequisiteExecutor } from '../../engine'
import {
  compare,
  subtract,
  apply,
  negate,
  between,
  toDays,
  sum,
  DurationInput,
} from '../../duration'

import { Processors, parseProcessors, parseContributions } from './utils'

type Computed = {
  real: Duration
  processed: Duration
  byDue: Duration
}

type ResultContext = {
  computed: Computed
}

type Params = {
  due?: Date
  expected: DurationInput
  processors?: Processors<{ computed: Computed }>
}

type Input = Pick<CalculatorInput, 'contributions'>

/**
 * Full contribution duration requisite factory.
 *
 * @todo make reached be (reached || TODAY) + remaining duration?
 *
 * @param expected The expected combined duration of all contributions.
 * @param due Date by which the expected duration must be achieved.
 * @param processors An optional map of date interval processors to apply to durations.
 *
 * i.e.:
 *  {
 *    processors: {
 *      '^': i => i,
 *      '2001^2002': i => i,
 *      '2001^': i => i,
 *      '^2001': i => i,
 *    }
 *  }
 */
const total = (config: Params): RequisiteExecutor<Input, ResultContext> => (
  input
) => {
  // compute processors and interval they apply.
  const processors = parseProcessors(config.processors || {})

  // compute splitted contributions based on due date and processors.
  const contributions = parseContributions(input.contributions, processors)

  // normalize expected duration to always calcualte based on days.
  const expected = normalize({ days: toDays(config.expected) })

  const computed = {
    real: NO_DURATION,
    processed: NO_DURATION,
    byDue: NO_DURATION,
  }

  let reached: Date

  for (const contribution of contributions) {
    const context = { input, expected, contribution, computed }
    const { start, end = TODAY } = contribution

    const real = between(start, end)

    const processed = processors
      .filter(contains({ start, end }))
      .reduce((result, { processor }) => processor(result, context), real)

    // sum-up real time-based duration so far.
    computed.real = normalize(sum(computed.real, real))

    // sum-up processed calculation purposed duration so far.
    computed.processed = normalize(sum(computed.processed, processed))

    // count duration for before-due computation, in case not reached due date.
    if (config.due && contribution.end <= config.due) {
      computed.byDue = normalize(sum(computed.byDue, processed))
    }

    // calculate reaching date, when it happens.
    if (!reached && compare.longer(computed.processed, expected, true)) {
      // find amount of extra days processed, unconsidering leap year days.
      const overlap = toDays(subtract(computed.processed, expected))

      // remove these extra days from end date.
      reached = ceil('days', apply(end, negate({ days: Math.round(overlap) })))
    }
  }

  return {
    context: { computed },
    satisfied: config.due ? reached && reached <= config.due : Boolean(reached),
    satisfiedAt: reached || NEVER,
    satisfiable: true,
    satisfiableAt: reached,
  }
}

export { total }
