import { CalculatorInput } from '../../types'
import { add } from '../date'
import { DurationInput, between } from '../duration'
import { RequisiteExecutor } from '../engine'

type Params = { expected: DurationInput; due: Date }
type Input = Pick<CalculatorInput, 'birthDate'>

/**
 * Age requisite factory.
 *
 * @param expected Age required described as a duration object.
 * @param due Date by which the age must be achieved.
 */
const age = ({ expected, due }: Params): RequisiteExecutor<Input> => (
  input
) => {
  const reaches = add(input.birthDate, expected, true)
  const satisfied = reaches <= due
  const satisfiedAt = satisfied ? reaches : undefined

  return {
    satisfied,
    satisfiedAt,
    satisfiable: false,
    satisfiableAt: undefined,
    context: { ageByDue: between(input.birthDate, due, true) },
  }
}

export { age }
