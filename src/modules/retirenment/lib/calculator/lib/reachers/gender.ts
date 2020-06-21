import { CalculatorInput } from '../../types'
import { RequisiteExecutor } from '../engine'

type Param = CalculatorInput['gender']
type Input = Pick<CalculatorInput, 'gender'>

/**
 * Gender requisite factory.
 */
const gender = (expected: Param): RequisiteExecutor<Input> => input => ({
  satisfied: input.gender === expected,
  satisfiable: false,
  satisfiedAt: null,
})

export { gender }
