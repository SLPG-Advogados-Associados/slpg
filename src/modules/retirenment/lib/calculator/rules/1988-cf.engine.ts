/* cspell: disable */
import * as reachers from '../lib/reachers'
import { Engine } from '../lib/engine'
import { Rule, Sex, Post, CalculatorInput, Contribution } from '../types'

const { TEACHER } = Post
const { MALE, FEMALE } = Sex

const { sex, contribution, age } = reachers

// Date when this rule became valid.
const promulgation = new Date('1988-10-05')

// Date when EC 20/1998 is approved, deprecating the below rules.
const due = new Date('1998-12-16')

const isTeacher = ({ service: { post } }: Contribution) => post === TEACHER

export type Input = CalculatorInput

const possibilities = [
  {
    title: 'Integral',
    description: `
      (...)
      III - voluntariamente:
      a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;
      b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;
      (...)
    `,
    requisites: new Engine<Input>({
      any: [
        {
          title: 'Tempo total de contribuição',
          description: `a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '35 anos de serviço',
                  executor: contribution.total({
                    due,
                    expected: { years: 35 },
                  }),
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
                  executor: contribution.total({
                    due,
                    expected: { years: 30 },
                  }),
                },
              ],
            },
          ],
        },

        {
          title: 'Tempo total de contribuição (magistério)',
          description: `b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '30 anos de serviço em funções de magistério',
                  executor: contribution.total({
                    due,
                    expected: { years: 30 },
                    processors: {
                      '^': contribution.filter(isTeacher),
                    },
                  }),
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
                  description: '25 anos de serviço em funções de magistério',
                  executor: contribution.total({
                    due,
                    expected: { years: 25 },
                    processors: {
                      '^': contribution.filter(isTeacher),
                    },
                  }),
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
      III - voluntariamente:
      (...)
      c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher, com proventos proporcionais a esse tempo;
      d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher, com proventos proporcionais ao tempo de serviço.
      (...)
    `,

    requisites: new Engine<Input>({
      any: [
        {
          title: 'Tempo total de contribuição',
          description: `c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher, com proventos proporcionais a esse tempo;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '30 anos de serviço',
                  executor: contribution.total({
                    due,
                    expected: { years: 30 },
                  }),
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
                  executor: contribution.total({
                    due,
                    expected: { years: 25 },
                  }),
                },
              ],
            },
          ],
        },

        {
          title: 'Idade',
          description: `d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher, com proventos proporcionais ao tempo de serviço.`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '65 anos de idade',
                  executor: age({ due, expected: { years: 65 } }),
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
                  description: '60 anos de idade',
                  executor: age({ due, expected: { years: 60 } }),
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
  description:
    'Regra do art. 40 da Constituição Federal de 1988, texto original',
  possibilities,
}

export { rule }
