/**
 * Contribution based conditions.
 * ------------------------------
 */

/* cspell: disable */
import { identity } from 'ramda'
import { CalculatorInput, Contribution, Reacher } from '../../../types'
import { ceil, min, max } from '../../date'
import { TODAY, NEVER, NO_DURATION } from '../../const'
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
} from '../../duration'

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
  due?: Date
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
): Reacher<{ computed: { real: Duration; processed: Duration } }> => (
  input
) => {
  const config: TotalReacherConfig = {
    split: (contribution) => [contribution],
    filter: () => true,
    process: identity,
    ..._config,
  }

  const dueSplit = config.due
    ? utils.splitAt(config.due)
    : (contribution) => [contribution]

  const expected = normalize({
    days: toDays(
      typeof _expected === 'function' ? _expected(input) : _expected
    ),
  })

  let reached: Date

  const computed = {
    real: NO_DURATION,
    processed: NO_DURATION,
    byDue: NO_DURATION,
  }

  for (const source of input.contributions) {
    const splitContext = { input, expected, contribution: source, computed }

    // allow spliting contributions, for granular processing.
    for (const splitted of config.split(source, splitContext)) {
      // default due date based splitting, for salary calculation purposes.
      for (const contribution of dueSplit(splitted)) {
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

        // sum up by due.
        computed.byDue =
          config.due && contribution.end <= config.due
            ? normalize(sum(computed.byDue, processed))
            : computed.byDue

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
  }

  const context = {
    computed,
    reachable: true,
    byDue: config.due ? computed.byDue : null,
  }

  return [reached || NEVER, context]
}

export { total, utils }
