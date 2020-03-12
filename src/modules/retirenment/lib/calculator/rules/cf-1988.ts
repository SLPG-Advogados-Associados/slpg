/* cspell: disable */
import { add } from 'date-fns'
import { Condition, Gender } from '../types'

export interface Input {
  gender: Gender
  birthDate: Date
  teacher: boolean
  contribution: {
    start: Date
  }
}

export interface ConditionContext {
  reached: Date
  integrality: boolean
}

/**
 * Date when EC 1998 is approved, deprecating the below rules.
 */
const due = new Date('1998-12-16')

const conditions: Condition<Input, ConditionContext>[] = [
  /**
   * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
   * com proventos integrais;
   */
  input => {
    const integrality = true

    const reached =
      input.gender === Gender.MALE
        ? add(input.contribution.start, { years: 35 })
        : add(input.contribution.start, { years: 30 })

    return [reached < due, { integrality, reached }]
  },

  /**
   * b) aos trinta anos de efetivo exercício em funções de magistério, se
   * professor, e vinte e cinco, se professora, com proventos integrais;
   */
  input => {
    const integrality = true

    const reached =
      input.gender === Gender.MALE
        ? add(input.contribution.start, { years: 30 })
        : add(input.contribution.start, { years: 25 })

    if (!input.teacher) return [false, { integrality, reached }]

    return [reached < due, { integrality, reached }]
  },

  /**
   * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
   * com proventos proporcionais a esse tempo;
   */
  input => {
    const integrality = false

    const reached =
      input.gender === Gender.MALE
        ? add(input.contribution.start, { years: 30 })
        : add(input.contribution.start, { years: 25 })

    return [reached < due, { integrality, reached }]
  },

  /**
   * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
   * com proventos proporcionais ao tempo de serviço.
   */
  // () => {},
]

export { conditions }
