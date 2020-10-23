import { groupWith } from 'ramda'
import type { RequisiteResult } from '../../engine'
import { CalculatorInput, Contribution } from '../../../types'
import { add } from '../../date'
import { DurationInput } from '../../duration'

type Params = {
  expected: DurationInput
  filter?: (contribution: Contribution) => boolean
}

type Input = Pick<CalculatorInput, 'contributions'>

const groupCareers = groupWith<Contribution>(
  (a, b) => a.service.career === b.service.career && a.end && a.end >= b.start
)

/**
 * Career duration requisite factory.
 *
 * @param expected The expected duration of the last contribution time.
 */
const career = ({ expected, filter = () => true }: Params) => (
  input: Input
): RequisiteResult[] =>
  groupCareers(input.contributions.filter(filter))
    // get first and last from career, they are all that matters here
    // last might be same as first, and it's ok
    .map((career) => [career[0], career[career.length - 1]])
    // get start of first, and end of last
    .map(([{ start }, { end }]) => ({
      from: add(start, expected),
      to: end,
    }))
    // it's only satisfiable if "from" ("start" of first) date happens before
    // "to" ("end" of last) of this contribution.
    .filter(({ from, to }) => !to || from <= to)

export { career }
