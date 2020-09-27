/* cspell: disable */
import * as reachers from '../lib/reachers'
import {
  Rule,
  Possibility,
  Sex,
  Post,
  ServiceKind,
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

const isPublic = ({ service }: Contribution) =>
  service.kind === ServiceKind.PUBLIC

type Input = CalculatorInput

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
          executor: after(dates.ec20),
        },

        {
          title: 'Tempo de serviço público',
          description: `III - (...) tempo mínimo de dez anos de efetivo exercício no serviço público (...)`,
          executor: total({
            due: dates.ec41,
            expected: { years: 10 },
            processors: {
              '^': processors.filter(isPublic),
            },
          }),
        },

        {
          title: 'Tempo no cargo de aposentadoria',
          description: `III - (...) cinco anos no cargo efetivo em que se dará a aposentadoria (...)`,
          executor: last({ expected: { years: 5 }, due: dates.ec41 }),
        },

        {
          title: 'Idade e tempo de contribuição',
          any: [
            {
              title: 'Homem',
              description: `sessenta anos de idade e trinta e cinco de contribuição, se homem`,
              all: [
                { executor: sex(MALE) },

                {
                  any: [
                    {
                      title: 'Geral',
                      all: [
                        {
                          description: '60 anos de idade',
                          executor: age({
                            due: dates.ec41,
                            expected: { years: 60 },
                          }),
                        },

                        {
                          description: '35 anos de contribuição',
                          executor: total({
                            due: dates.ec41,
                            expected: { years: 35 },
                          }),
                        },
                      ],
                    },

                    {
                      title: 'Professor',
                      all: [
                        {
                          description: '55 anos de idade',
                          executor: age({
                            due: dates.ec41,
                            expected: { years: 55 },
                          }),
                        },

                        {
                          description: '30 anos de contribuição',
                          executor: total({
                            due: dates.ec41,
                            expected: { years: 30 },
                            processors: {
                              '^': processors.filter(isTeacher),
                            },
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
              description: `cinqüenta e cinco anos de idade e trinta de contribuição, se mulher;`,
              all: [
                { executor: sex(FEMALE) },

                {
                  any: [
                    {
                      title: 'Geral',
                      all: [
                        {
                          description: '55 anos de idade',
                          executor: age({
                            due: dates.ec41,
                            expected: { years: 55 },
                          }),
                        },

                        {
                          description: '30 anos de contribuição',
                          executor: total({
                            due: dates.ec41,
                            expected: { years: 30 },
                          }),
                        },
                      ],
                    },

                    {
                      title: 'Professora',
                      all: [
                        {
                          description: '50 anos de idade',
                          executor: age({
                            due: dates.ec41,
                            expected: { years: 50 },
                          }),
                        },

                        {
                          description: '25 anos de contribuição',
                          executor: total({
                            due: dates.ec41,
                            expected: { years: 25 },
                            processors: {
                              '^': processors.filter(isTeacher),
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

      § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
      cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
      comprove exclusivamente tempo de efetivo exercício das funções de
      magistério na educação infantil e no ensino fundamental e médio.
      (...)
    `,
    requisites: new Engine<Input>({
      all: [
        {
          executor: after(dates.ec20),
        },

        {
          title: 'Tempo de serviço público',
          description: `III - (...) tempo mínimo de dez anos de efetivo exercício no serviço público (...)`,
          executor: total({
            due: dates.ec41,
            expected: { years: 10 },
            processors: {
              '^': processors.filter(isPublic),
            },
          }),
        },

        {
          title: 'Tempo no cargo de aposentadoria',
          description: `III - (...) cinco anos no cargo efetivo em que se dará a aposentadoria (...)`,
          executor: last({ expected: { years: 5 }, due: dates.ec41 }),
        },

        {
          title: 'Idade',
          any: [
            {
              title: 'Homem',
              description: `sessenta e cinco anos de idade, se homem`,
              all: [
                { executor: sex(MALE) },

                {
                  description: '65 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 65 } }),
                },
              ],
            },

            {
              title: 'Mulher',
              description: `sessenta anos de idade, se mulher`,
              all: [
                { executor: sex(FEMALE) },

                {
                  description: '60 anos de idade',
                  executor: age({ due: dates.ec41, expected: { years: 60 } }),
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
  title: 'EC nº 20 - Regra Permanente',
  description: 'Regra permanente como descrita na EC nº 20, de 1998',
  possibilities,
}

export { rule }
