/* cspell: disable */
import { isEqual } from '../lib/date'
import * as reachers from '../lib/reachers'
import { multiply, subtract } from '../lib/duration'
import {
  Rule,
  Possibility,
  Sex,
  Post,
  CalculatorInput,
  Contribution,
} from '../types'
import { Engine } from '../lib/engine'
import { dates } from './dates'

const { MALE, FEMALE } = Sex
const { TEACHER } = Post

const { sex, contribution, age, after } = reachers
const { processors, last, total } = contribution

const isTeacher = ({ service: { post } }: Contribution) => post === TEACHER

/**
 * Processor factory for deducting a toll after prommulgation.
 */
const toll = (
  perc: number
): reachers.Processor<{ computed: { processed: Duration } }> => {
  // use "input" as ref for memoized context
  const deducted = []

  return (duration, { expected, contribution, computed }) => {
    if (
      // ensure we only deduct toll once.
      !deducted.includes(computed) &&
      isEqual(contribution.start, dates.ec20)
    ) {
      // use "input" as ref for memoized context
      deducted.push(computed)

      const missing = subtract(expected, computed.processed)
      const toll = multiply(perc, missing)

      return subtract(duration, toll)
    }

    return duration
  }
}

type Input = CalculatorInput

const possibilities: Possibility[] = [
  {
    title: 'Integral',
    description: `
      (...)
      I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;
      II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;
      III - contar tempo de contribuição igual, no mínimo, à soma de:

        a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
        b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

      (...)

      § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
      membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
      tempo de serviço exercido até a publicação desta Emenda contado com o
      acréscimo de dezessete por cento.
            
      § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
      dos Municípios, incluídas suas autarquias e fundações, que, até a data da
      publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
      de magistério e que opte por aposentar-se na forma do disposto no
      "caput", terá o tempo de serviço exercido até a publicação desta Emenda
      contado com o acréscimo de dezessete por cento, se homem, e de vinte por
      cento, se mulher, desde que se aposente, exclusivamente, com tempo de
      efetivo exercício das funções de magistério.

      (...)
    `,
    requisites: new Engine<Input>({
      all: [
        {
          executor: after(dates.ec20),
        },

        {
          title: 'Idade',
          description: `I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '53 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 53 } }),
                },
              ],
            },

            {
              all: [
                {
                  description: 'Mulher',
                  executor: sex(FEMALE),
                },
                {
                  description: '48 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 48 } }),
                },
              ],
            },
          ],
        },

        {
          title: 'Tempo no cargo de aposentadoria',
          description: `II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;`,
          executor: last({ expected: { years: 5 }, due: dates.ec41 }),
        },

        {
          title: 'Tempo total de contribuição',
          description: `
            III - contar tempo de contribuição igual, no mínimo, à soma de:

              a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
              b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

              (...)

              § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
              membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
              tempo de serviço exercido até a publicação desta Emenda contado com o
              acréscimo de dezessete por cento.

              § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
              dos Municípios, incluídas suas autarquias e fundações, que, até a data da
              publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
              de magistério e que opte por aposentar-se na forma do disposto no
              "caput", terá o tempo de serviço exercido até a publicação desta Emenda
              contado com o acréscimo de dezessete por cento, se homem, e de vinte por
              cento, se mulher, desde que se aposente, exclusivamente, com tempo de
              efetivo exercício das funções de magistério.
            `,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '35 anos de serviço',
                  any: [
                    {
                      // debug: (args) =>
                      //   console.log(JSON.stringify(args, null, 2)),
                      description: 'Geral',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 35 },
                        processors: {
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },

                    // {
                    //   description: 'Magistrado',
                    //   executor: ...
                    // },

                    {
                      description: 'Magistério',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 35 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.17),
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },
                  ],
                },
              ],
            },

            {
              all: [
                {
                  description: 'Mulher',
                  executor: sex(FEMALE),
                },
                {
                  description: '30 anos de serviço',
                  any: [
                    {
                      description: 'Geral',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 30 },
                        processors: {
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },

                    // {
                    //   description: 'Magistrado',
                    //   executor: ...
                    // },

                    {
                      description: 'Magistério',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 30 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.2),
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
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

      (...)

      § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
      membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
      tempo de serviço exercido até a publicação desta Emenda contado com o
      acréscimo de dezessete por cento.

      § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
      dos Municípios, incluídas suas autarquias e fundações, que, até a data da
      publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
      de magistério e que opte por aposentar-se na forma do disposto no
      "caput", terá o tempo de serviço exercido até a publicação desta Emenda
      contado com o acréscimo de dezessete por cento, se homem, e de vinte por
      cento, se mulher, desde que se aposente, exclusivamente, com tempo de
      efetivo exercício das funções de magistério.
    `,

    requisites: new Engine<Input>({
      all: [
        {
          executor: after(dates.ec20),
        },

        {
          title: 'Idade',
          description: `I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '53 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 53 } }),
                },
              ],
            },

            {
              all: [
                {
                  description: 'Mulher',
                  executor: sex(FEMALE),
                },
                {
                  description: '48 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 48 } }),
                },
              ],
            },
          ],
        },

        {
          title: 'Tempo no cargo de aposentadoria',
          description: `II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;`,
          executor: last({ expected: { years: 5 }, due: dates.ec41 }),
        },

        {
          title: 'Tempo total de contribuição',
          description: `
            I - contar tempo de contribuição igual, no mínimo, à soma de:

              a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
              b) um período adicional de contribuição equivalente a quarenta por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior;

              (...)

              § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
              membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
              tempo de serviço exercido até a publicação desta Emenda contado com o
              acréscimo de dezessete por cento.

              § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
              dos Municípios, incluídas suas autarquias e fundações, que, até a data da
              publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
              de magistério e que opte por aposentar-se na forma do disposto no
              "caput", terá o tempo de serviço exercido até a publicação desta Emenda
              contado com o acréscimo de dezessete por cento, se homem, e de vinte por
              cento, se mulher, desde que se aposente, exclusivamente, com tempo de
              efetivo exercício das funções de magistério.
            `,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '30 anos de serviço',
                  any: [
                    {
                      description: 'Geral',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 30 },
                        processors: {
                          '1998-12-16^': toll(0.4),
                        },
                      }),
                    },

                    // {
                    //   description: 'Magistrado',
                    //   executor: total({
                    //     due: dates.ec41,
                    //     expected: { years: 30 },
                    //   }),
                    // },

                    {
                      description: 'Magistério',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 30 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.17),
                          '1998-12-16^': toll(0.4),
                        },
                      }),
                    },
                  ],
                },
              ],
            },

            {
              all: [
                {
                  description: 'Mulher',
                  executor: sex(FEMALE),
                },
                {
                  description: '25 anos de serviço',
                  any: [
                    {
                      description: 'Geral',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 25 },
                        processors: {
                          '1998-12-16^': toll(0.4),
                        },
                      }),
                    },

                    // {
                    //   description: 'Magistrado',
                    //   executor: total({
                    //     due: dates.ec41,
                    //     expected: { years: 25 },
                    //   }),
                    // },

                    {
                      description: 'Magistério',
                      executor: total({
                        due: dates.ec41,
                        expected: { years: 25 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.2),
                          '1998-12-16^': toll(0.4),
                        },
                      }),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
]

const rule: Rule = {
  promulgation: dates.ec20,
  due: dates.ec41,
  title: 'EC nº 20 - Regra de Transição',
  description: 'Regra de transição como descrita na EC nº 20, de 1998',
  possibilities,
}

export { rule }
