import { CalculatorInput } from '../../types'
import { add } from '../date'
import { DurationInput } from '../duration'
import { str } from '../debug'
import type { RequisiteResult } from '../engine'
import { named } from './utils'

type Params = { expected: DurationInput }
type Input = Pick<CalculatorInput, 'birthDate'>

/**
 * Age requisite factory.
 *
 * @param expected Age required described as a duration object.
 */
const age = ({ expected }: Params) =>
  named(
    (input: Input): RequisiteResult[] => [
      { from: add(input.birthDate, expected, true) },
    ],
    `age ${str.duration(expected)}`
  )

export { age }
