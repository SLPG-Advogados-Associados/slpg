import { RequisiteResults, CalculatorInput, Sex } from '../../types'
import { ALWAYS } from '../const'

type Input = Pick<CalculatorInput, 'sex'>

/**
 * Sex requisite factory.
 */
const sex = (expected: Sex) => (input: Input): RequisiteResults =>
  input.sex === expected ? [ALWAYS] : []

export { sex }
