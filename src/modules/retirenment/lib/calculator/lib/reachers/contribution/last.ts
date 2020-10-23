import type { RequisiteResult } from '../../engine'
import { CalculatorInput, Contribution } from '../../../types'
import { add } from '../../date'
import { DurationInput } from '../../duration'

type Params = {
  expected: DurationInput
  filter?: (contribution: Contribution) => boolean
}

type Input = Pick<CalculatorInput, 'contributions'>

/**
 * Last contribution duration requisite factory.
 *
 * @param expected The expected duration of the last contribution time.
 */
const last = ({ expected, filter = () => true }: Params) => (
  input: Input
): RequisiteResult[] =>
  input.contributions
    .filter(filter)
    .map(({ start, end }) => ({ from: add(start, expected, true), to: end }))
    // it's only satisfiable if "from" date happens before "to" ("end") of this contribution.
    .filter(({ from, to }) => !to || from <= to)

export { last }
