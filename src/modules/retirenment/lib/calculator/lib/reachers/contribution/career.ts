import { CalculatorInput } from '../../../types'
import { add, min } from '../../date'
import { TODAY } from '../../const'
import { between, DurationInput } from '../../duration'
import { RequisiteExecutor } from '../../engine'

type Params = { due: Date; expected: DurationInput }
type Input = Pick<CalculatorInput, 'contributions'>

/**
 * Career duration requisite factory.
 *
 * @todo consider the possibility that another career before the last
 * be the one that the retirement time was reached first.
 *
 * @todo should allow filtering contribution time for public service.
 *
 * @param expected The expected duration of the last contribution time.
 * @param due Date by which the expected duration must be achieved.
 */
const career = ({ expected, due }: Params): RequisiteExecutor<Input> => (
  input
) => {
  // find contributions that belong to same career as last post.
  const contributions = [...input.contributions]
    .reverse()
    .filter(
      ({ service: { career } }, _, arr) => career === arr[0].service.career
    )
    .reverse()

  const first = contributions[0]
  const last = contributions[contributions.length - 1]

  if (!first || !last) {
    return {
      satisfied: false,
      satisfiedAt: undefined,
      satisfiableAt: undefined,
      satisfiable: false,
    }
  }

  const { start } = first
  const { end } = last

  const satisfiedAt = add(start, expected)
  const satisfied = satisfiedAt <= min([due, end || TODAY])

  // is satisfiable if it's still counting (no end) and will satisfy before due.
  const satisfiable = satisfied || (satisfiedAt <= due && !end)
  const satisfiableAt = satisfiable ? satisfiedAt : undefined

  return {
    satisfied,
    satisfiedAt: satisfied ? satisfiedAt : undefined,
    satisfiable,
    satisfiableAt,
    context: {
      durationByDue: between(start, end ? min([due, end]) : due, true),
    },
  }
}

export { career }
