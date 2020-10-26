import { CalculatorInput } from './types'
import { rules } from './rules'

/**
 * Execute input against rules.
 */
const calculate = (input: CalculatorInput) =>
  rules.map(
    (rule) =>
      [
        rule,
        rule.possibilities.map(
          (possibility) =>
            [possibility, possibility.requisites.execute(input)] as const
        ),
      ] as const
  )

export { calculate }
