/* cspell: disable */
import { BaseRule } from './base'
import { Condition, Gender, Contribution, ConditionContextBase } from '../types'
import { age, contribution, merge } from '../lib/conditions'

const { MALE, FEMALE } = Gender

export interface Input {
  gender: Gender
  birthDate: Date
  contributions: Contribution[]
}

export interface ConditionContext extends ConditionContextBase {
  integrality: boolean
}

/**
 * Date when EC 41/2003 is approved, deprecating the below rules.
 */
const due = new Date('2003-12-31')

const reusable = {
  /**
   * (...)
   * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
   * de idade, se mulher;
   * (...)
   */
  age: {
    [MALE]: age(due)(53),
    [FEMALE]: age(due)(48),
  },

  contribution: {
    /**
     * (...)
     * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
     * aposentadoria;
     * (...)
     */
    last: contribution.last(due)(5),
  },
}

const conditions: Condition<Input, ConditionContext>[] = [
  /**
   * Integral
   * --------
   *
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
    const integrality = true

    const subConditions = [
      reusable.age[input.gender],
      reusable.contribution.last,

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
      contribution.total(due)({ [MALE]: 35, [FEMALE]: 30 }[input.gender]),
    ]

    const [satisfied, { reached }] = merge.all(subConditions)(input)

    return [satisfied, { reached, integrality }]
  },

  /**
   * Proporcional
   * ------------
   *
   * § 1º - O servidor de que trata este artigo, desde que atendido o disposto
   * em seus incisos I e II, e observado o disposto no art. 4º desta Emenda,
   * pode aposentar-se com proventos proporcionais ao tempo de contribuição,
   * quando atendidas as seguintes condições;
   *
   * I - contar tempo de contribuição igual, no mínimo, à soma de:
   *
   * a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
   *
   * b) um período adicional de contribuição equivalente a quarenta por cento do
   * tempo que, na data da publicação desta Emenda, faltaria para atingir o
   * limite de tempo constante da alínea anterior;
   *
   * @todo: a) and b) not currently considered!
   */
  input => {
    const integrality = false

    const subConditions = [
      reusable.age[input.gender],
      reusable.contribution.last,

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
      contribution.total(due)({ [MALE]: 30, [FEMALE]: 25 }[input.gender]),
    ]

    const [satisfied, { reached }] = merge.all(subConditions)(input)

    return [satisfied, { reached, integrality }]
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
