/* cspell: disable */
import { max, isEqual } from '../lib/date'
import * as reachers from '../lib/reachers'
import { multiply, subtract } from '../lib/duration'
import { Rule, Possibility, Sex, Post, Operation } from '../types'

const { MALE, FEMALE } = Sex
const { TEACHER } = Post

// Date when this rule became active.
const promulgation = new Date('1998-12-16')

// Date when EC 41/2003 is approved, deprecating the below rules.
const due = new Date('2003-12-31')

const processor = (
  integrality: boolean
): reachers.contribution.TotalReacherConfig => ({
  due,
  split: reachers.contribution.utils.splitAt(promulgation),
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
     *
     * @todo: not filtering?
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
        }[input.sex],
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
    conditions: [
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      {
        description: 'Idade mínima',
        execute: reachers.age(
          (input) => ({ years: { [MALE]: 53, [FEMALE]: 48 }[input.sex] }),
          { due }
        ),
      },

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      {
        description: 'Tempo no último cargo',
        execute: reachers.contribution.last({ years: 5 }, { due }),
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
      {
        description: 'Tempo total de contribuição',
        execute: reachers.contribution.total(
          (input) => ({ years: { [MALE]: 35, [FEMALE]: 30 }[input.gender] }),
          processor(true)
        ),
      },
    ],

    execute(input) {
      const [age, last, total] = this.conditions

      const result = {
        op: Operation.AND,
        conditions: [
          [age, age.execute(input)],
          [last, last.execute(input)],
          [total, total.execute(input)],
        ] as const,
      }

      const reached = max(
        result.conditions.map(([, [date]]) => date).concat(promulgation)
      )

      return [reached <= due, { reached, result }]
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

    conditions: [
      /**
       * (...)
       * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
       * de idade, se mulher;
       * (...)
       */
      {
        description: 'Idade mínima',
        execute: reachers.age(
          (input) => ({ years: { [MALE]: 53, [FEMALE]: 48 }[input.gender] }),
          { due }
        ),
      },

      /**
       * (...)
       * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
       * aposentadoria;
       * (...)
       */
      {
        description: 'Tempo no último cargo',
        execute: reachers.contribution.last({ years: 5 }, { due }),
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
      {
        description: 'Tempo total de contribuição',
        execute: reachers.contribution.total(
          (input) => ({ years: { [MALE]: 30, [FEMALE]: 25 }[input.sex] }),
          processor(false)
        ),
      },
    ],

    execute(input) {
      const [age, last, total] = this.conditions

      const result = {
        op: Operation.AND,
        conditions: [
          [age, age.execute(input)],
          [last, last.execute(input)],
          [total, total.execute(input)],
        ] as const,
      }

      const reached = max(
        result.conditions.map(([, [date]]) => date).concat(promulgation)
      )

      return [reached <= due, { reached, result }]
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
