/* cspell: disable */
import { add } from 'date-fns'
import * as reach from '../lib/reachers'

import {
  Contribution,
  Condition,
  ConditionContextBase,
  Gender,
  Post,
} from '../types'

interface Input {
  gender: Gender
  birthDate: Date
  contributions: Contribution[]
}

interface ResultContext extends ConditionContextBase {
  integrality: boolean
}

const { TEACHER } = Post
const { MALE, FEMALE } = Gender

// Date when this rule became valid.
const promulgation = new Date('1988-10-05')

// Date when EC 20/1998 is approved, deprecating the below rules.
const due = new Date('1998-12-16')

const conditions: Condition<Input, ResultContext>[] = [
  /**
   * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
   * com proventos integrais;
   */
  input => {
    const integrality = true
    const years = { [MALE]: 35, [FEMALE]: 30 }[input.gender]

    const [reached] = reach.contribution.total({ years })(input)

    return [reached < due, { integrality, reached }]
  },

  /**
   * b) aos trinta anos de efetivo exercício em funções de magistério, se
   * professor, e vinte e cinco, se professora, com proventos integrais;
   */
  input => {
    const integrality = true
    const years = { [MALE]: 30, [FEMALE]: 25 }[input.gender]

    const contributions = input.contributions.filter(
      ({ service }) => service.post === TEACHER
    )

    const [reached] = reach.contribution.total({ years })({ contributions })

    return [reached < due, { integrality, reached }]
  },

  /**
   * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
   * com proventos proporcionais a esse tempo;
   */
  input => {
    const integrality = false
    const years = { [MALE]: 30, [FEMALE]: 25 }[input.gender]

    const [reached] = reach.contribution.total({ years })(input)

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

const rule = {
  due,
  promulgation,
  title: 'CF 1988',
  description:
    'Regra do art. 40 da Constituição Federal de 1988, texto original',
}

export { conditions, rule }
