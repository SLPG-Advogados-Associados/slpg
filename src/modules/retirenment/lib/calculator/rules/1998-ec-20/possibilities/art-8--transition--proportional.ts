import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { isTeacher } from '../../../lib/predicates'
import { Possibility, Requisites } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total } = contribution
const { filter, toll, bonus } = processors

type Input = CalculatorInput

const possibility = new Possibility({
  title: 'Art. 8º (proporcional)',
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

  requisites: new Requisites<Input>({
    all: [
      {
        title: 'Idade',
        any: [
          {
            title: 'Homem',
            description: '53 anos',
            all: [
              { executor: sex(MALE) },
              { executor: age({ expected: { years: 53 } }) },
            ],
          },

          {
            title: 'Mulher',
            description: '48 anos',
            all: [
              { executor: sex(FEMALE) },
              { executor: age({ expected: { years: 48 } }) },
            ],
          },
        ],
      },

      {
        title: 'Tempo no cargo de aposentadoria',
        executor: last({ expected: { years: 5 } }),
      },

      {
        title: 'Tempo de contribuição',
        details: `
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
            title: 'Homem',
            description: '30 anos de serviço',
            all: [
              { executor: sex(MALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    // satisfiable: startBefore(due),
                    executor: total({
                      expected: { years: 30 },
                      processors: {
                        '1998-12-16^': toll(0.4),
                      },
                    }),
                  },

                  {
                    title: 'Magistério',
                    // satisfiable: startBefore(due),
                    executor: total({
                      expected: { years: 30 },
                      processors: {
                        '^': filter(isTeacher),
                        '^1998-12-16': bonus(1.17),
                        '1998-12-16^': toll(0.4),
                      },
                    }),
                  },
                ],
              },
            ],
          },

          {
            title: 'Mulher',
            description: '25 anos de serviço',
            all: [
              { executor: sex(FEMALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    // satisfiable: startBefore(due),
                    executor: total({
                      expected: { years: 25 },
                      processors: {
                        '1998-12-16^': toll(0.4),
                      },
                    }),
                  },

                  {
                    title: 'Magistério',
                    // satisfiable: startBefore(due),
                    executor: total({
                      expected: { years: 25 },
                      processors: {
                        '^': filter(isTeacher),
                        '^1998-12-16': bonus(1.2),
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
})

export { possibility }
