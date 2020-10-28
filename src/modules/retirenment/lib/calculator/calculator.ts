import { CalculatorInput } from './types'
import { rules } from './rules'

/**
 * Execute input against rules.
 */
const calculate = (input: CalculatorInput) =>
  rules.map((rule) => rule.execute(input))

export { calculate }
