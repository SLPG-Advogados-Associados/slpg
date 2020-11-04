import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { isTeacher } from '../../../lib/predicates'
import { Possibility, Requisites } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { contribution, sex } = reachers
const { processors, total } = contribution
const { filter } = processors

const possibility = new Possibility({
  title: 'Art. 40º (integral)',
  description: `
      (...)
      III - voluntariamente:
      a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;
      b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;
      (...)
    `,
  requisites: new Requisites<CalculatorInput>({
    all: [
      {
        title: 'Tempo de Contribuição',
        any: [
          {
            title: 'Homem',
            all: [
              { executor: sex(MALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    description: '35 anos de contribuição',
                    executor: total({ expected: { years: 35 } }),
                  },
                  {
                    title: 'Magistério',
                    description: '30 anos de contribuição',
                    executor: total({
                      expected: { years: 30 },
                      processors: { '^': filter(isTeacher) },
                    }),
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
                    description: '30 anos de contribuição',
                    executor: total({ expected: { years: 30 } }),
                  },
                  {
                    title: 'Magistério',
                    description: '25 anos de contribuição',
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
  }),
})

export { possibility }
