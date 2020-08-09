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
  const satisfiedAt = add(input.birthDate, expected, true)

  return {
    satisfied: satisfiedAt <= due,
    satisfiable: false,
    satisfiedAt,
    context: { ageByDue: between(input.birthDate, due, true) },
  }
}

export { age }
