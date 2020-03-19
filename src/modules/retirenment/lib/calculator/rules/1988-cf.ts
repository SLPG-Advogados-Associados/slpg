/* cspell: disable */
import { add } from 'date-fns'
import { BaseRule } from './base'
import { Condition, ConditionContextBase, Gender } from '../types'

const { MALE, FEMALE } = Gender

export interface Input {
  gender: Gender
  birthDate: Date
  teacher: boolean
  contribution: {
    start: Date
  }
}

export interface ConditionContext extends ConditionContextBase {
  integrality: boolean
}

/**
 * Date when EC 20/1998 is approved, deprecating the below rules.
 */
const due = new Date('1998-12-16')

const conditions: Condition<Input, ConditionContext>[] = [
  /**
   * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
   * com proventos integrais;
   */
  input => {
    const integrality = true
    const years = { [MALE]: 35, [FEMALE]: 30 }[input.gender]

    const reached = add(input.contribution.start, { years })

    return [reached < due, { integrality, reached }]
  },

  /**
   * b) aos trinta anos de efetivo exercício em funções de magistério, se
   * professor, e vinte e cinco, se professora, com proventos integrais;
   */
  input => {
    const integrality = true
    const years = { [MALE]: 30, [FEMALE]: 25 }[input.gender]

    const reached = add(input.contribution.start, { years })

    return [input.teacher && reached < due, { integrality, reached }]
  },

  /**
   * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
   * com proventos proporcionais a esse tempo;
   */
  input => {
    const integrality = false
    const years = { [MALE]: 30, [FEMALE]: 25 }[input.gender]

    const reached = add(input.contribution.start, { years })

    return [reached < due, { integrality, reached }]
  },

  /**
   * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
   * com proventos proporcionais ao tempo de serviço.
   */
  input => {
    const integrality = false
    const years = { [MALE]: 65, [FEMALE]: 60 }[input.gender]

    const reached = add(input.birthDate, { years })

    return [reached < due, { integrality, reached }]
  },
]

const description =
  'Regra do art. 40 da Constituição Federal de 1988, texto original'

class Rule1988CF extends BaseRule<Input, ConditionContext> {
  public static date = new Date('1988-10-05')
  public static title = 'CF 1988'
  public static description = description

  constructor(input) {
    super(input, conditions)
  }
}

export { conditions, Rule1988CF }
