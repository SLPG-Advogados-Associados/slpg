import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { Possibility, Requisites } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { age, contribution, sex } = reachers
const { total } = contribution

const possibility = new Possibility({
  title: 'Art. 40. - Proporcional',
  description: `
      (...)
      III - voluntariamente:
      (...)
      c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher, com proventos proporcionais a esse tempo;
      d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher, com proventos proporcionais ao tempo de serviço.
      (...)
    `,

  requisites: new Requisites<CalculatorInput>({
    all: [
      {
        any: [
          {
            title: 'Tempo total de contribuição',
            details: `c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher, com proventos proporcionais a esse tempo;`,
            any: [
              {
                title: 'Homem',
                description: '30 anos de serviço',
                all: [
                  { executor: sex(MALE) },
                  { executor: total({ expected: { years: 30 } }) },
                ],
              },

              {
                title: 'Mulher',
                description: '25 anos de serviço',
                all: [
                  { executor: sex(FEMALE) },
                  { executor: total({ expected: { years: 25 } }) },
                ],
              },
            ],
          },

          {
            title: 'Idade',
            details: `d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher, com proventos proporcionais ao tempo de serviço.`,
            any: [
              {
                title: 'Homem',
                description: '65 anos de idade',
                all: [
                  { executor: sex(MALE) },
                  { executor: age({ expected: { years: 65 } }) },
                ],
              },

              {
                title: 'Mulher',
                description: '60 anos de idade',
                all: [
                  { executor: sex(FEMALE) },
                  { executor: age({ expected: { years: 60 } }) },
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
