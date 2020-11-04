import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { isPublic } from '../../../lib/predicates'
import { Possibility, Requisites } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total } = contribution
const { filter } = processors

type Input = CalculatorInput

const possibility = new Possibility({
  title: 'Art. 40. - Proporcional',
  description: `
    (...)
    III - voluntariamente, desde que cumprido tempo mínimo de dez anos de
    efetivo exercício no serviço público e cinco anos no cargo efetivo em que se
    dará a aposentadoria, observadas as seguintes condições:

    (...)

    b) sessenta e cinco anos de idade, se homem, e sessenta anos de idade, se
    mulher, com proventos proporcionais ao tempo de contribuição.
    (...)
  `,
  requisites: new Requisites<Input>({
    all: [
      {
        title: 'Tempo de serviço público',
        details: `III - (...) tempo mínimo de dez anos de efetivo exercício no serviço público (...)`,
        executor: total({
          expected: { years: 10 },
          processors: {
            '^': filter(isPublic),
          },
        }),
      },

      {
        title: 'Tempo no cargo de aposentadoria',
        details: `III - (...) cinco anos no cargo efetivo em que se dará a aposentadoria (...)`,
        executor: last({ expected: { years: 5 } }),
      },

      {
        title: 'Idade',
        any: [
          {
            title: 'Homem',
            description: '65 anos',
            all: [
              { executor: sex(MALE) },
              { executor: age({ expected: { years: 65 } }) },
            ],
          },

          {
            title: 'Mulher',
            description: '60 anos',
            all: [
              { executor: sex(FEMALE) },
              { executor: age({ expected: { years: 60 } }) },
            ],
          },
        ],
      },
    ],
  }),
})

export { possibility }
