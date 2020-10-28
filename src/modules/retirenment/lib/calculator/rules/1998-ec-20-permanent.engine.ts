/* cspell: disable */
import { Possibility, Sex, CalculatorInput } from '../types'
import * as reachers from '../lib/reachers'
import { Engine } from '../lib/engine'
import { Rule } from '../lib/rule'
import { isTeacher, isPublic } from '../lib/predicates'
import { dates } from './dates'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total } = contribution
const { filter } = processors
const { startBefore } = Engine.satisfy

type Input = CalculatorInput

const promulgation = dates.ec20
const due = dates.ec41

const possibilities: Possibility[] = [
  {
    title: 'Integral',
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
    requisites: new Engine<Input>({
      all: [
        {
          title: 'Tempo de serviço público',
          description: '10 anos',
          details: `III - (...) tempo mínimo de dez anos de efetivo exercício no serviço público (...)`,
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
                          satisfiable: startBefore(due),
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
                          satisfiable: startBefore(due),
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
                          satisfiable: startBefore(due),
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
                          satisfiable: startBefore(due),
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
  },

  {
    title: 'Proporcional',
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
    requisites: new Engine<Input>({
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
  },
]

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 20 - Regra Permanente',
  description: 'Regra permanente como descrita na EC nº 20, de 1998',
  possibilities,
})

export { rule }
