/* cspell: disable */
import { sum, isNegative } from 'duration-fns'
import { age, contribution, merge } from '../lib/conditions'
import { multiply, split, DurationProcessor } from '../lib/duration'
import { TODAY, NO_DURATION } from '../lib/const'

import {
  Condition,
  Gender,
  Contribution,
  ConditionContextBase,
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

const { MALE, FEMALE } = Gender
const { TEACHER } = Post

// Date when this rule became active.
const start = new Date('1998-12-16')

// Date when EC 41/2003 is approved, deprecating the below rules.
const due = new Date('2003-12-31')

const processors = {
  /**
   * Custom contribution duration processor to add exception indexes.
   */
  duration: (
    input: Input
  ): DurationProcessor<{ contribution: Contribution }> => (
    duration,
    { contribution: { start, end = TODAY, service } }
  ) => {
    if (service.post !== TEACHER) {
      return duration
    }

    // (...) acréscimo de dezessete por cento, se homem, e de vinte por cento, se mulher
    const by = { [MALE]: 1.17, [FEMALE]: 1.2 }[input.gender]

    // (...) tempo de serviço exercido até a publicação desta Emenda contado com
    // o acréscimo (...)
    const [before, after] = split({ start, end }, due)

    return sum(
      isNegative(before) ? NO_DURATION : multiply(by, before, start),
      isNegative(after) ? NO_DURATION : after
    )
  },
}

const conditions: Condition<Input, ResultContext>[] = [
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
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      age(due)({ years: { [MALE]: 53, [FEMALE]: 48 }[input.gender] }),

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      contribution.last(due)({ years: 5 }),

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
       *
       * (...)
       *
       * § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
       * membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
       * tempo de serviço exercido até a publicação desta Emenda contado com o
       * acréscimo de dezessete por cento.
       *
       * § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
       * dos Municípios, incluídas suas autarquias e fundações, que, até a data da
       * publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
       * de magistério e que opte por aposentar-se na forma do disposto no
       * "caput", terá o tempo de serviço exercido até a publicação desta Emenda
       * contado com o acréscimo de dezessete por cento, se homem, e de vinte por
       * cento, se mulher, desde que se aposente, exclusivamente, com tempo de
       * efetivo exercício das funções de magistério.
       */
      contribution.total(due)(
        { years: { [MALE]: 35, [FEMALE]: 30 }[input.gender] },
        processors.duration(input)
      ),
    ]

    const [satisfied, { reached }] = merge.all(subConditions)(input)

    return [satisfied, { reached, integrality }]
  },

  /**
   * Proporcional
   * ------------
   *
   * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
   * de idade, se mulher;
   *
   * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
   * aposentadoria;
   *
   * (...)
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
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      age(due)({ years: { [MALE]: 53, [FEMALE]: 48 }[input.gender] }),

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      contribution.last(due)({ years: 5 }),

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
      contribution.total(due)({
        years: { [MALE]: 30, [FEMALE]: 25 }[input.gender],
      }),
    ]

    const [satisfied, { reached }] = merge.all(subConditions)(input)

    return [satisfied, { reached, integrality }]
  },
]

const rule = {
  start,
  due,
  title: 'EC nº 20 - Regra de Transição',
  description: 'Regra de transição como descrita na EC nº 20, de 1998',
}

export { conditions, rule }
