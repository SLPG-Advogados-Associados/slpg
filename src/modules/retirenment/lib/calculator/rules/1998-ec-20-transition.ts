/* cspell: disable */
import { BaseRule } from './base'
import { Condition, Gender, Contribution } from '../types'
import { age, contribution, merge } from '../lib/conditions'

const { MALE, FEMALE } = Gender

export interface Input {
  gender: Gender
  birthDate: Date
  contributions: Contribution[]
}

export interface ConditionContext {
  reached: Date
  integrality: boolean
}

/**
 * Date when EC 41/2003 is approved, deprecating the below rules.
 */
const due = new Date('2003-12-31')

const conditions: Condition<Input, ConditionContext>[] = [
  /**
   * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
   * de idade, se mulher;
   *
   * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
   * aposentadoria;
   *
   * III - contar tempo de contribuição igual, no mínimo, à soma de:
   *
   * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
   *
   * b) um período adicional de contribuição equivalente a vinte por cento do
   * tempo que, na data da publicação desta Emenda, faltaria para atingir o
   * limite de tempo constante da alínea anterior.
   */
  input => {
    const subConditions = [
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      age(due, { [MALE]: 53, [FEMALE]: 48 }[input.gender]),

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      contribution.last(due, 5),

      /**
       * (...)
       * III - contar tempo de contribuição igual, no mínimo, à soma de:
       *
       * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
       *
       * b) um período adicional de contribuição equivalente a vinte por cento do
       * tempo que, na data da publicação desta Emenda, faltaria para atingir o
       * limite de tempo constante da alínea anterior.
       * (...)
       *
       * @todo: a) and b) not currently considered!
       */
      contribution.total(due, { [MALE]: 35, [FEMALE]: 30 }[input.gender]),
    ]

    return merge.all(subConditions, input)
  },
]

const description = 'Regra de transição como descrita na EC nº 20, de 1998'

class Rule1998EC20Transition extends BaseRule<Input, ConditionContext> {
  public static date = new Date('1998-12-16')
  public static title = 'EC nº 20 - Regra de Transição'
  public static description = description

  constructor(input) {
    super(input, conditions)
  }
}

export { conditions, Rule1998EC20Transition }
