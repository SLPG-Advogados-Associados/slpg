import { normalize } from 'duration-fns'

import { CalculatorInput } from '../../../types'
import { ceil } from '../../date'
import { FUTURE, NO_DURATION } from '../../const'
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

import { named } from '../utils'
import { str } from '../../debug'
import { parseContributions } from './utils/contribution'

import {
  Processors,
  parseProcessors,
  mergeProcessors,
} from './utils/processors'

type Computed = {
  real: Duration
  processed: Duration
}

type Params = {
  expected: DurationInput
  processors?: Processors<{ computed: Computed }>
}

type Input = CalculatorInput

/**
 * Full contribution duration requisite factory.
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
const total = (config: Params) =>
  named((input: Input): RequisiteResult[] => {
    // compute processors and interval they apply.
    const processors = parseProcessors(config.processors || {})
    const processor = mergeProcessors(processors)

    // compute splitted contributions based on due date and processors.
    const contributions = parseContributions(input.contributions, processors)

    // normalize expected duration to always calcualte based on days.
    const expected = normalize({ days: toDays(config.expected) })

    const computed = {
      real: NO_DURATION,
      processed: NO_DURATION,
    }

    let from: Date

    for (const contribution of contributions) {
      const { start, end = FUTURE } = contribution
      const context = { input, expected, contribution, computed }

      const real = between(start, end)
      const processed = processor(real, context)

      // sum-up real time-based duration so far.
      computed.real = normalize(sum(computed.real, real))

      // sum-up processed calculation purposed duration so far.
      computed.processed = normalize(sum(computed.processed, processed))

      // calculate reaching date, when it happens.
      if (!from && compare.longer(computed.processed, expected, true)) {
        // find amount of extra days processed, unconsidering leap year days.
        const overlap = toDays(subtract(computed.processed, expected))

        // remove these extra days from end date.
        from = ceil('days', apply(end, negate({ days: Math.round(overlap) })))
      }
    }

    return from ? [{ from }] : []
  }, `total ${str.duration(config.expected)}`)

export { total }
