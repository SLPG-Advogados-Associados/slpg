import { CalculatorInput, Contribution } from '../../../../types'
import { TODAY } from '../../../const'
import { parseInterval, contains } from '../../../date'
import {
  DurationInput,
  EMPTY_DURATION,
  multiply as multiplyDuration,
} from '../../../duration'

export type ProcessorContext<ExtraContext = {}> = ExtraContext & {
  input: CalculatorInput
  expected: DurationInput
  contribution: Contribution
}

export type Processor<ExtraContext = {}> = (
  duration: Duration,
  context: ProcessorContext<ExtraContext>
) => DurationInput

export type Processors<ExtraContext = {}> = {
  [key: string]: Processor<ExtraContext>
}

export type ParsedProcessor<ExtraContext = {}> = {
  end?: Date | null
  start?: Date | null
  processor: Processor<ExtraContext>
}

export type ParsedProcessors<ExtraContext = {}> = ParsedProcessor<
  ExtraContext
>[]

/**
 * Parse processor map into processors.
 */
const parseProcessors = (processors: Processors): ParsedProcessors =>
  Object.entries(processors).map(([interval, processor]) => {
    const { start, end } = parseInterval(interval)
    return { start, end, processor }
  })

/**
 * Processor factory to filter out/in contribution durations.
 */
const filter = (
  predicate: (
    contribution: Contribution,
    duration: Duration,
    context: ProcessorContext
  ) => boolean
): Processor => (duration, context) =>
  predicate(context.contribution, duration, context) ? duration : EMPTY_DURATION

/**
 * Specialized processor for applying multiplication to resulting durations.
 */
const multiply = (by: number): Processor => (duration) =>
  multiplyDuration(by, duration)

/**
 * Merges multiple processors into one.
 */
const mergeProcessors = (processors: ParsedProcessor[]) => (
  initial: Duration,
  context: ProcessorContext
) => {
  const { start, end = TODAY } = context.contribution

  return processors
    .filter(contains({ start, end }))
    .reduce((result, { processor }) => processor(result, context), initial)
}

export { parseProcessors, filter, multiply, mergeProcessors }
