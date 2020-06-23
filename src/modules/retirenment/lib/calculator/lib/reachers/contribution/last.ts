import { last as getLast } from 'ramda'
import { CalculatorInput } from '../../../types'
import { add, min } from '../../date'
import { TODAY } from '../../const'
import { between, DurationInput } from '../../duration'
import { RequisiteExecutor } from '../../engine'

type Params = { due: Date; expected: DurationInput }
type Input = Pick<CalculatorInput, 'contributions'>

/**
 * Last contribution duration requisite factory.
 *
 * @todo consider the possibility that another post before the last
 * be the one that the retirement time was reached first.
 *
 * @todo should allow filtering contribution time.
 *
 * @param expected The expected duration of the last contribution time.
 * @param due Date by which the expected duration must be achieved.
 */
const last = ({ expected, due }: Params): RequisiteExecutor<Input> => input => {
  const { start, end } = getLast(input.contributions)

  const satisfiedAt = add(start, expected)
  const satisfied = satisfiedAt <= min([due, end || TODAY])

  return {
    satisfied,
    satisfiedAt,
    // is satisfiable if it's still counting (no end) and will satisfy before due.
    satisfiable: satisfied || (satisfiedAt <= due && !end),
    context: {
      durationByDue: between(start, end ? min([due, end]) : due, true),
    },
  }
}

export { last }
