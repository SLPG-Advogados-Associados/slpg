import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { isTeacher, isPublic } from '../../../lib/predicates'
import { Possibility, Requisites } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total } = contribution
const { filter } = processors

type Input = CalculatorInput

const possibility = new Possibility({
  title: 'Art. 40º (integral)',
  description: `
    (...)
    III - voluntariamente, desde que cumprido tempo mínimo de dez anos de
    efetivo exercício no serviço público e cinco anos no cargo efetivo em que se
    dará a aposentadoria, observadas as seguintes condições:

    a) sessenta anos de idade e trinta e cinco de contribuição, se homem, e
    cinqüenta e cinco anos de idade e trinta de contribuição, se mulher;

    (...)

    § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
    cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
    comprove exclusivamente tempo de efetivo exercício das funções de
    magistério na educação infantil e no ensino fundamental e médio.
    (...)
  `,
  requisites: new Requisites<Input>({
    all: [
      {
        title: 'Tempo de serviço público',
        description: '10 anos',
        details: `III - (...) tempo mínimo de dez anos de efetivo exercício no serviço público (...)`,
        satisfiable: () => true,
        executor: total({
          expected: { years: 10 },
          processors: {
            '^': filter(isPublic),
          },
        }),
      },

      {
        title: 'Tempo no cargo',
        description: '5 anos',
        details: `III - (...) cinco anos no cargo efetivo em que se dará a aposentadoria (...)`,
        executor: last({ expected: { years: 5 } }),
      },

      {
        title: 'Idade e tempo de contribuição',
        any: [
          {
            title: 'Homem',
            all: [
              { executor: sex(MALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    all: [
                      {
                        description: '60 anos de idade',
                        executor: age({ expected: { years: 60 } }),
                      },
                      {
                        description: '35 anos de contribuição',
                        satisfiable: () => true,
                        executor: total({ expected: { years: 35 } }),
                      },
                    ],
                  },

                  {
                    title: 'Magistério',
                    all: [
                      {
                        description: '55 anos de idade',
                        executor: age({ expected: { years: 55 } }),
                      },
                      {
                        description: '30 anos de contribuição',
                        satisfiable: () => true,
                        executor: total({
                          expected: { years: 30 },
                          processors: { '^': filter(isTeacher) },
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            title: 'Mulher',
            all: [
              { executor: sex(FEMALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    all: [
                      {
                        description: '55 anos de idade',
                        executor: age({ expected: { years: 55 } }),
                      },
                      {
                        description: '30 anos de contribuição',
                        satisfiable: () => true,
                        executor: total({ expected: { years: 30 } }),
                      },
                    ],
                  },

                  {
                    title: 'Magistério',
                    all: [
                      {
                        description: '50 anos de idade',
                        executor: age({ expected: { years: 50 } }),
                      },
                      {
                        description: '25 anos de contribuição',
                        satisfiable: () => true,
                        executor: total({
                          expected: { years: 25 },
                          processors: { '^': filter(isTeacher) },
                        }),
                      },
                    ],
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
