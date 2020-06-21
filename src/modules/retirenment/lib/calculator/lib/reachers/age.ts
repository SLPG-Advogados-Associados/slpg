import { CalculatorInput } from '../../types'
import { add } from '../date'
import { DurationInput, between } from '../duration'
import { RequisiteExecutor } from '../engine'

type Params = { duration: DurationInput; due: Date }
type Input = Pick<CalculatorInput, 'birthDate'>

/**
 * Age requisite factory.
 *
 * @param duration Age required describe in a duration object.
 * @param due Date by which the age must be achieved.
 */
const age = ({ duration, due }: Params): RequisiteExecutor<Input> => input => {
  const satisfiedAt = add(input.birthDate, duration, true)

  return {
    satisfied: satisfiedAt <= due,
    satisfiable: false,
    satisfiedAt,
    context: { ageByDue: between(input.birthDate, due, true) },
  }
}

export { age }
