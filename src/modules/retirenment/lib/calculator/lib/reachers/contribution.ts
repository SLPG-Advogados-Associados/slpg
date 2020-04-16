/**
 * Contribution based conditions.
 * ------------------------------
 */

/* cspell: disable */
import { last as getLast, identity } from 'ramda'
import { CalculatorInput, Contribution, Reacher } from '../../types'
import { add, ceil, min, max } from '../date'
import { TODAY, NEVER, NO_DURATION } from '../const'
import {
  compare,
  between,
  normalize,
  DurationInput,
  sum,
  Duration,
  apply,
  subtract,
  negate,
  toDays,
} from '../duration'

/**
 * Last contribution duration reacher.
 *
 * @todo consider the possibility that another post before the last
 * be the one that the retirement time was reached first.
 *
 * @param duration The expected duration of the last contribution by due date.
 */
const last = (expected: DurationInput): Reacher => input => {
  const { start, end } = getLast(input.contributions)
  const reached = add(start, expected)

  return [!end || reached <= end ? reached : NEVER]
}

type ComputedDurations = {
  real: Duration
  processed: Duration
}

type Context = {
  input: CalculatorInput
  expected: DurationInput
  contribution: Contribution
  computed: ComputedDurations
}

export type TotalReacherConfig = Partial<{
  split: (contribution: Contribution, context: Context) => Contribution[]
  filter: (contribution: Contribution, context: Context) => boolean
  process: (duration: Duration, context: Context) => DurationInput
}>

/**
 * Full contribution duration reacher.
 *
 * @todo make reached be (reached || TODAY) + remaining duration?
 *
 * @param expected The expected combined duration of all contributions, or a factory to it.
 * @param config.process A processor to alter a provided duration accountability.
 * @param config.filter A filter to remove contributions.
 * @param config.split A duration split callback to allow processing in isolation.
 */
const total = (
  _expected: DurationInput | ((input: CalculatorInput) => DurationInput),
  _config?: TotalReacherConfig
): Reacher<{ computed: { real: Duration; processed: Duration } }> => input => {
  const config: TotalReacherConfig = {
    split: contribution => [contribution],
    filter: () => true,
    process: identity,
    ..._config,
  }

  const expected = normalize({
    days: toDays(
      typeof _expected === 'function' ? _expected(input) : _expected
    ),
  })

  let reached: Date
  const computed = { real: NO_DURATION, processed: NO_DURATION }

  for (const source of input.contributions) {
    const splitContext = { input, expected, contribution: source, computed }

    // allow spliting contributions, for granular processing.
    for (const contribution of config.split(source, splitContext)) {
      // processing context.
      const context = { input, expected, contribution, computed }

      // allow skipping contribution periods.
      if (!config.filter(contribution, context)) continue

      const { start, end = TODAY } = contribution

      // plain isolated duration addition.
      const real = between(start, end)

      // processed duration, with possible manipulation.
      const processed = config.process(real, context)

      // sum-up real time-based duration so far, with start as reference.
      computed.real = normalize(sum(computed.real, real))

      // sum-up processed calculation purposed duration so far, with start as reference
      computed.processed = normalize(sum(computed.processed, processed))

      // calculate reaching date, when it happens.
      if (!reached && compare.longer(computed.processed, expected, true)) {
        // find amount of extra days processed, unconsidering leap year days.
        const overlap = toDays(subtract(computed.processed, expected))

        // remove these extra days from end date.
        reached = ceil(
          'days',
          apply(end, negate({ days: Math.round(overlap) }))
        )
      }
    }
  }

  return [reached || NEVER, { computed }]
}

const utils = {
  /**
   * Create a contribution time splitter based on the passed middle-point date.
   */
  splitAt: (date: Date) => (contribution: Contribution) => {
    const { start, end } = contribution

    // no split necessary:
    if (start >= date || (end && end <= date)) return [contribution]

    const left = { ...contribution, start, end: min([end || TODAY, date]) }
    const right = { ...contribution, start: max([start, date]), end }

    return [left, right]
  },
}

export { last, total, utils }
