/* cspell: disable */
import { max, min, isValid } from '../lib/date'
import * as reachers from '../lib/reachers'
import { Rule, Possibility, Gender, Post, Operation } from '../types'

const { TEACHER } = Post
const { MALE, FEMALE } = Gender

// Date when this rule became valid.
const promulgation = new Date('1988-10-05')

// Date when EC 20/1998 is approved, deprecating the below rules.
const due = new Date('1998-12-16')

const possibilities: Possibility[] = [
  {
    title: 'Integral',
    description: `
      (...)
      III - voluntariamente:
      a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher, com proventos integrais;
      b) aos trinta anos de efetivo exercício em funções de magistério, se professor, e vinte e cinco, se professora, com proventos integrais;
      (...)
    `,
    conditions: [
      /**
       * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
       * com proventos integrais;
       */
      {
        description: 'Tempo total de contribuição',
        execute: reachers.contribution.total(
          input => ({ years: { [MALE]: 35, [FEMALE]: 30 }[input.gender] }),
          { due }
        ),
      },

      /**
       * b) aos trinta anos de efetivo exercício em funções de magistério, se
       * professor, e vinte e cinco, se professora, com proventos integrais;
       */
      {
        description: 'Tempo total de contribuição (magistério)',
        execute: reachers.contribution.total(
          input => ({ years: { [MALE]: 30, [FEMALE]: 25 }[input.gender] }),
          { due, filter: ({ service }) => service.post === TEACHER }
        ),
      },
    ],

    execute(input) {
      const [general, teacher] = this.conditions

      const result = {
        op: Operation.OR,
        conditions: [
          [general, general.execute(input)],
          [teacher, teacher.execute(input)],
        ] as const,
      }

      const dates = result.conditions.map(([, [date]]) => date).filter(isValid)
      const reached = max([min(dates), promulgation])

      return [reached <= due, { reached, result }]
    },
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
    conditions: [
      /**
       * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se
       * mulher, com proventos proporcionais a esse tempo;
       */
      {
        description: 'Tempo total de contribuição',
        execute: reachers.contribution.total(
          input => ({ years: { [MALE]: 30, [FEMALE]: 25 }[input.gender] }),
          { due }
        ),
      },

      /**
       * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se
       * mulher, com proventos proporcionais ao tempo de serviço.
       */
      {
        description: 'Idade',
        execute: reachers.age(
          input => ({ years: { [MALE]: 65, [FEMALE]: 60 }[input.gender] }),
          { due }
        ),
      },
    ],

    execute(input) {
      const [general, teacher] = this.conditions

      const result = {
        op: Operation.OR,
        conditions: [
          [general, general.execute(input)],
          [teacher, teacher.execute(input)],
        ] as const,
      }

      const dates = result.conditions.map(([, [date]]) => date).filter(isValid)
      const reached = max([min(dates), promulgation])

      return [reached <= due, { reached, result }]
    },
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
