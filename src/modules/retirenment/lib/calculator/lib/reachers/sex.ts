import type { RequisiteResult } from '../engine'
import { CalculatorInput, Sex } from '../../types'
import { named } from './utils'

type Input = Pick<CalculatorInput, 'sex'>

/**
 * Sex requisite factory.
 */
const sex = (expected: Sex) =>
  named(
    (input: Input): RequisiteResult[] =>
      // object with no from/to means "always"
      input.sex === expected ? [{}] : [],
    `sex ${expected}`
  )

export { sex }
