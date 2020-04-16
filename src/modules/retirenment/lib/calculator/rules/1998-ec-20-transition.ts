/* cspell: disable */
import { max, isEqual } from '../lib/date'
import * as reacher from '../lib/reachers'
import { multiply, subtract } from '../lib/duration'

import { Rule, Possibility, Gender, Post, Input } from '../types'

const { MALE, FEMALE } = Gender
const { TEACHER } = Post

// Date when this rule became active.
const promulgation = new Date('1998-12-16')

// Date when EC 41/2003 is approved, deprecating the below rules.
const due = new Date('2003-12-31')

const processor = (
  integrality: boolean
): reacher.contribution.TotalReacherConfig<Input> => ({
  split: reacher.contribution.utils.splitAt(promulgation),
  process: (duration, { contribution, input, computed, expected }) => {
    let result = duration

    /**
     * (...)
     * b) um período adicional de contribuição equivalente a vinte por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior.
     *
     * (...)
     *
     * b) um período adicional de contribuição equivalente a quarenta por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior;
     * (...)
     *
     * Step back of 20%/40% of was missing by promulgation day.
     */
    if (isEqual(contribution.start, promulgation)) {
      const missing = subtract(expected, computed.processed)
      const toll = multiply(integrality ? 0.2 : 0.4, missing)

      result = subtract(result, toll)
    }

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
      result = multiply(
        {
          [MALE]: 1.17,
          [FEMALE]: 1.2,
        }[input.gender],
        result
      )
    }

    return result
  },
})

const possibilities: Possibility[] = [
  {
    title: 'Integral',
    description: `
      (...)
      I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anosde idade, se mulher;
      II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;
      III - contar tempo de contribuição igual, no mínimo, à soma de:

      a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
      b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

      (...)

      § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e dos Municípios, incluídas suas autarquias e fundações, que, até a data da publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo de magistério e que opte por aposentar-se na forma do disposto no "caput", terá o tempo de serviço exercido até a publicação desta Emenda contado com o acréscimo de dezessete por cento, se homem, e de vinte por cento, se mulher, desde que se aposente, exclusivamente, com tempo de efetivo exercício das funções de magistério.

      (...)
    `,
    condition: input => {
      const reachers = {
        /**
         * (...)
         * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
         * de idade, se mulher;
         * (...)
         */
        age: {
          description: 'Idade mínima',
          condition: reacher.age({
            years: { [MALE]: 53, [FEMALE]: 48 }[input.gender],
          }),
        },

        /**
         * (...)
         * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
         * aposentadoria;
         * (...)
         */
        last: {
          description: 'Tempo no último cargo',
          condition: reacher.contribution.last({ years: 5 }),
        },

        /**
         * (...)
         * III - contar tempo de contribuição igual, no mínimo, à soma de:
         *
         * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
         *
         * b) um período adicional de contribuição equivalente a vinte por cento do
         * tempo que, na data da publicação desta Emenda, faltaria para atingir o
         * limite de tempo constante da alínea anterior.
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
        total: {
          description: 'Tempo total de contribuição',
          condition: reacher.contribution.total(
            { years: { [MALE]: 35, [FEMALE]: 30 }[input.gender] },
            processor(true)
          ),
        },
      }

      const conditions = [
        [reachers.age, reachers.age.condition(input)],
        [reachers.last, reachers.last.condition(input)],
        [reachers.total, reachers.total.condition(input)],
      ] as const

      const reached = max(
        conditions.map(([, [date]]) => date).concat(promulgation)
      )

      return [reached <= due, { reached, conditions }]
    },
  },

  {
    title: 'Proporcional',
    description: `
    I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;
    II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;

    (...)

    § 1º - O servidor de que trata este artigo, desde que atendido o disposto
    em seus incisos I e II, e observado o disposto no art. 4º desta Emenda,
    pode aposentar-se com proventos proporcionais ao tempo de contribuição,
    quando atendidas as seguintes condições;

    I - contar tempo de contribuição igual, no mínimo, à soma de:

    a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
    b) um período adicional de contribuição equivalente a quarenta por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior;
    `,
    condition: input => {
      const reachers = {
        /**
         * (...)
         * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
         * de idade, se mulher;
         * (...)
         */
        age: {
          description: 'Idade mínima',
          condition: reacher.age({
            years: { [MALE]: 53, [FEMALE]: 48 }[input.gender],
          }),
        },

        /**
         * (...)
         * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
         * aposentadoria;
         * (...)
         */
        last: {
          description: 'Tempo no último cargo',
          condition: reacher.contribution.last({ years: 5 }),
        },

        /**
         * (...)
         * I - contar tempo de contribuição igual, no mínimo, à soma de:
         *
         * a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
         *
         * b) um período adicional de contribuição equivalente a quarenta por cento do
         * tempo que, na data da publicação desta Emenda, faltaria para atingir o
         * limite de tempo constante da alínea anterior;
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
        total: {
          description: 'Tempo total de contribuição',
          condition: reacher.contribution.total(
            { years: { [MALE]: 30, [FEMALE]: 25 }[input.gender] },
            processor(false)
          ),
        },
      }

      const conditions = [
        [reachers.age, reachers.age.condition(input)],
        [reachers.last, reachers.last.condition(input)],
        [reachers.total, reachers.total.condition(input)],
      ] as const

      const reached = max(
        conditions.map(([, [date]]) => date).concat(promulgation)
      )

      return [reached <= due, { reached, conditions }]
    },
  },
]

const rule: Rule = {
  promulgation,
  due,
  title: 'EC nº 20 - Regra de Transição',
  description: 'Regra de transição como descrita na EC nº 20, de 1998',
  possibilities,
}

export { rule }
