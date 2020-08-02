import { CalculatorInput } from '../../types'
import { RequisiteExecutor } from '../engine'

type Param = CalculatorInput['sex']
type Input = Pick<CalculatorInput, 'sex'>

/**
 * Sex requisite factory.
 */
const sex = (expected: Param): RequisiteExecutor<Input> => input => ({
  satisfied: input.sex === expected,
  satisfiable: false,
  satisfiedAt: null,
})

export { sex }
