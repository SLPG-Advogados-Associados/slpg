import { CalculatorInput, RequisiteResults } from '../../types'
import { add } from '../date'
import { DurationInput } from '../duration'

type Params = { expected: DurationInput }
type Input = Pick<CalculatorInput, 'birthDate'>

/**
 * Age requisite factory.
 *
 * @param expected Age required described as a duration object.
 */
const age = ({ expected }: Params) => (input: Input): RequisiteResults => [
  { from: add(input.birthDate, expected, true) },
]

export { age }
