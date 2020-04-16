import { CalculatorInput } from './types'
import { rules } from './rules'

const calculate = (input: CalculatorInput) =>
  rules.map(
    rule =>
      [
        rule,
        rule.possibilities.map(
          possibility => [possibility, possibility.execute(input)] as const
        ),
      ] as const
  )

export { calculate }
