/* cspell: disable */
import * as reachers from '../lib/reachers'
import { Engine } from '../lib/engine'
import { Rule, Sex, Post, CalculatorInput, Contribution } from '../types'
import { dates } from './dates'

const { TEACHER } = Post
const { MALE, FEMALE } = Sex
const { startBefore } = Engine.satisfy

const {
  sex,
  contribution: {
    total,
    processors: { filter },
  },
  age,
  after,
  before,
} = reachers

const isTeacher = ({ service: { post } }: Contribution) => post === TEACHER

const due = dates.ec20
const promulgation = dates.constitution

const possibilities = [
  {
    title: 'Art. 40. - Integral',
    description: `
      (...)
      III - voluntariamente:
      a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;
      b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;
      (...)
    `,
    requisites: new Engine<CalculatorInput>({
      all: [
        { executor: after(promulgation) },
        { executor: before(due) },
        {
          title: 'Tempo de Contribuição',
          any: [
            {
              title: 'Geral',
              details: `a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;`,
              any: [
                {
                  title: 'Homem',
                  description: '35 anos de serviço',
                  all: [
                    { executor: sex(MALE) },
                    {
                      satisfiable: startBefore(due),
                      executor: total({ expected: { years: 35 } }),
                    },
                  ],
                },

                {
                  title: 'Mulher',
                  description: '30 anos de serviço',
                  all: [
                    { executor: sex(FEMALE) },
                    {
                      satisfiable: startBefore(due),
                      executor: total({ expected: { years: 30 } }),
                    },
                  ],
                },
              ],
            },

            {
              title: 'Magistério',
              details: `b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;`,
              any: [
                {
                  title: 'Homem',
                  description: `30 anos de serviço`,
                  all: [
                    { executor: sex(MALE) },
                    {
                      satisfiable: startBefore(due),
                      executor: total({
                        expected: { years: 30 },
                        processors: { '^': filter(isTeacher) },
                      }),
                    },
                  ],
                },

                {
                  title: 'Mulher',
                  description: `25 anos de serviço`,
                  all: [
                    { executor: sex(FEMALE) },
                    {
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
    }),
  },

  {
    title: 'Art. 40. - Proporcional',
    description: `
      (...)
      III - voluntariamente:
      (...)
      c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher, com proventos proporcionais a esse tempo;
      d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher, com proventos proporcionais ao tempo de serviço.
      (...)
    `,

    requisites: new Engine<CalculatorInput>({
      all: [
        { executor: after(promulgation) },
        { executor: before(due) },
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
                    {
                      satisfiable: startBefore(due),
                      executor: total({ expected: { years: 30 } }),
                    },
                  ],
                },

                {
                  title: 'Mulher',
                  description: '25 anos de serviço',
                  all: [
                    { executor: sex(FEMALE) },
                    {
                      satisfiable: startBefore(due),
                      executor: total({ expected: { years: 25 } }),
                    },
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
  },
]

const rule: Rule = {
  due,
  promulgation,
  title: 'CF 1988',
  description: `Regra do art. 40 da Constituição Federal de 1988, texto original`,
  possibilities,
}

export { rule }
