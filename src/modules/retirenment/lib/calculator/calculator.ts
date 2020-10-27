import { CalculatorInput } from './types'
import { rules } from './rules'
import { all } from './lib/engine/result'

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
            [
              possibility,
              all([
                [{ from: rule.promulgation, to: rule.due }],
                possibility.requisites.execute(input),
              ]),
            ] as const
        ),
      ] as const
  )

export { calculate }
