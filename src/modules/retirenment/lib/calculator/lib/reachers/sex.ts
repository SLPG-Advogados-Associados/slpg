import { RequisiteResults, CalculatorInput, Sex } from '../../types'

type Input = Pick<CalculatorInput, 'sex'>

/**
 * Sex requisite factory.
 */
const sex = (expected: Sex) => (input: Input): RequisiteResults =>
  // object with no from/to means "always"
  input.sex === expected ? [{}] : []

export { sex }
