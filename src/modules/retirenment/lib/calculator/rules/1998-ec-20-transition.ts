/* cspell: disable */
import { max } from '../lib/date'
import * as reacher from '../lib/reachers'
import { multiply } from '../lib/duration'

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
const promulgation = new Date('1998-12-16')

// Date when EC 41/2003 is approved, deprecating the below rules.
const due = new Date('2003-12-31')

const processor: reacher.contribution.TotalReacherConfig<Input> = {
  split: reacher.contribution.utils.splitAt(promulgation),
  process: (duration, { contribution, input }) => {
    /**
     * (...)
     * § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
     * dos Municípios, incluídas suas autarquias e fundações, que, até a data da
     * publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
     * de magistério e que opte por aposentar-se na forma do disposto no
     * "caput", terá o tempo de serviço exercido até a publicação desta Emenda
     * contado com o acréscimo de dezessete por cento, se homem, e de vinte por
     * cento, se mulher, desde que se aposente, exclusivamente, com tempo de
     * efetivo exercício das funções de magistério.
     * (...)
     */
    if (
      contribution.service.post === TEACHER &&
      contribution.end <= promulgation
    ) {
      // (...) acréscimo de dezessete por cento, se homem, e de vinte por cento, se mulher
      return multiply({ [MALE]: 1.17, [FEMALE]: 1.2 }[input.gender], duration)
    }

    return duration
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

    const reachers = [
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      reacher.age({ years: { [MALE]: 53, [FEMALE]: 48 }[input.gender] }),

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      reacher.contribution.last({ years: 5 }),

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
       * @todo: b) is currently not considered!
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
      reacher.contribution.total(
        { years: { [MALE]: 35, [FEMALE]: 30 }[input.gender] },
        processor
      ),
    ]

    const [reached, reachersContext] = reacher.merge.all(reachers)(input)

    const context = {
      reached: max([reached, promulgation]),
      integrality,
      reachersContext,
    }

    return [reached <= due, context]
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
   * @todo: b) is currently not considered!
   */
  input => {
    const integrality = false

    const reachers = [
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      reacher.age({ years: { [MALE]: 53, [FEMALE]: 48 }[input.gender] }),

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      reacher.contribution.last({ years: 5 }),

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
       * @todo: b) is currently not considered!
       */
      reacher.contribution.total({
        years: { [MALE]: 30, [FEMALE]: 25 }[input.gender],
      }),
    ]

    const [reached, reachersContext] = reacher.merge.all(reachers)(input)

    const context = {
      reached: max([reached, promulgation]),
      integrality,
      reachersContext,
    }

    return [reached <= due, context]
  },
]

const rule = {
  promulgation,
  due,
  title: 'EC nº 20 - Regra de Transição',
  description: 'Regra de transição como descrita na EC nº 20, de 1998',
}

export { conditions, rule }
