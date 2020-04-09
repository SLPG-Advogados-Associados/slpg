/**
 * Contribution based conditions.
 * ------------------------------
 */

/* cspell: disable */
import { last as getLast, identity } from 'ramda'
import { min, max } from 'date-fns'
import {
  sum,
  normalize,
  Duration,
  apply,
  subtract,
  negate,
  toDays,
} from 'duration-fns'
import { add, ceil } from '../date'
import { TODAY, NEVER } from '../const'
import { compare, between, DurationInput } from '../duration'
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
  const reached = add(start, expected)

  return [!end || reached <= end ? reached : NEVER]
}

type Context<Input> = {
  input: Input
  expected: DurationInput
  contribution: Contribution
}

export type TotalReacherConfig<Input> = Partial<{
  split: (contribution: Contribution, context: Context<Input>) => Contribution[]
  filter: (contribution: Contribution, context: Context<Input>) => boolean
  process: (duration: Duration, context: Context<Input>) => DurationInput
}>

type TotalReacherFactory = <
  ExtraInput extends object,
  Input extends ContributionsInput & ExtraInput
>(
  expected: DurationInput | ((input: Input) => DurationInput),
  config?: TotalReacherConfig<Input>
) => Reacher<Input, { durations: { real: Duration; processed: Duration } }>

/**
 * Full contribution duration reacher.
 *
 * @param expected The expected combined duration of all contributions, or a factory to it.
 * @param config.process A processor to alter a provided duration accountability.
 * @param config.filter A filter to remove contributions.
 * @param config.split A duration split callback to allow processing in isolation.
 */
const total: TotalReacherFactory = (_expected, _config) => input => {
  const config: TotalReacherConfig<typeof input> = {
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

  const durations = { real: {}, processed: {} } as {
    real: Duration
    processed: Duration
  }

  for (const source of input.contributions) {
    const splitContext = { input, expected, contribution: source }

    // allow spliting contributions, for granular processing.
    for (const contribution of config.split(source, splitContext)) {
      // processing context.
      const context = { input, expected, contribution }

      // allow skipping contribution periods.
      if (!config.filter(contribution, context)) continue

      const { start, end = TODAY } = contribution

      // plain isolated duration addition.
      const real = between(start, end)

      // processed duration, with possible manipulation.
      const processed = config.process(real, context)

      // sum-up real time-based duration so far, with start as reference.
      durations.real = normalize(sum(durations.real, real))

      // sum-up processed calculation purposed duration so far, with start as reference
      durations.processed = normalize(sum(durations.processed, processed))

      // calculate reaching date, when it happens.
      if (!reached && compare.longer(durations.processed, expected, true)) {
        // find amount of extra days processed, unconsidering leap year days.
        const overlap = toDays(subtract(durations.processed, expected))

        // remove these extra days from end date.
        reached = ceil(
          'days',
          apply(end, negate({ days: Math.round(overlap) }))
        )
      }
    }
  }

  return [reached || NEVER, { durations }]
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
