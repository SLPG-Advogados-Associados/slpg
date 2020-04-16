/* cspell: disable */
import { c, d, u } from '../lib/test-utils'
import { NEVER } from '../lib/const'
import { Gender, Contribution, Post } from '../types'
import { rule } from './1988-cf'

const { TEACHER: T } = Post
const { MALE: M, FEMALE: F } = Gender

describe('retirement/calculator/rules/cf-1988', () => {
  describe('possibilities', () => {
    const [integral, proportional] = rule.possibilities

    const i = (
      gender: Gender,
      contributions: Contribution[],
      birthDate: Date = new Date('1940')
    ) => ({
      gender,
      birthDate,
      contributions,
    })

    describe('integral', () => {
      describe('conditions', () => {
        const [general, teacher] = integral.conditions

        /**
         * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
         * com proventos integrais;
         */
        it.each([
          // male
          [i(M, [c('63')]), d('1997-12-23')],
          [i(M, [c('64')]), d('1998-12-23')],
          [i(M, [c('1980')]), d('2014-12-23')],
          // female
          [i(F, [c('67')]), d('1996-12-24')],
          [i(F, [c('69')]), d('1998-12-25')],
          [i(F, [c('1980')]), d('2009-12-24')],
        ])('should reach by contribution', (input, expected) => {
          const [reached] = general.execute(input)
          expect(reached).toEqual(expected)
        })

        /**
         * b) aos trinta anos de efetivo exercício em funções de magistério, se
         * professor, e vinte e cinco, se professora, com proventos integrais;
         */
        it.each([
          // male teacher
          [i(M, [c('63', [u, T])]), d('1992-12-24')],
          // female teacher
          [i(F, [c('63', [u, T])]), d('1987-12-26')],

          // non-teacher
          [i(M, [c('60')]), NEVER],
          [i(F, [c('60')]), NEVER],

          // mixed post types

          // male teacher
          [i(M, [c('60^70'), c('70', [u, T])]), d('1999-12-25')],
          [i(M, [c('60^67'), c('67', [u, T])]), d('1996-12-24')],
          [i(M, [c('60^67'), c('69', [u, T])]), d('1998-12-25')],

          // female teacher
          [i(F, [c('60^75'), c('75', [u, T])]), d('1999-12-26')],
          [i(F, [c('60^72'), c('72', [u, T])]), d('1996-12-25')],
          [i(F, [c('60^72'), c('74', [u, T])]), d('1998-12-26')],
        ])('should reach by teacher contribution', (input, expected) => {
          const [reached] = teacher.execute(input)
          expect(reached).toEqual(expected)
        })
      })

      it.each([
        [i(M, [c('60')]), true, d('1994-12-23')], //          male, 38/00, general ✅, teacher ❌ (in valid period)
        [i(M, [c('65')]), false, d('1999-12-24')], //         male, 33/00, general ❌, teacher ❌ (in valid period)
        [i(M, [c('65', [u, T])]), true, d('1994-12-25')], //  male, 33/30, general ❌, teacher ✅ (in valid period)
        [i(M, [c('70', [u, T])]), false, d('1999-12-25')], // male, 28/28, general ❌, teacher ❌ (after valid period)
        [i(M, [c('60', [u, T])]), true, d('1989-12-24')], //  male, 30/30, general ✅, teacher ✅ (in valid period)

        [i(F, [c('65')]), true, d('1994-12-25')], //          female, 33/00, general ✅, teacher ❌ (in valid period)
        [i(F, [c('70')]), false, d('1999-12-25')], //         female, 28/00, general ❌, teacher ❌ (in valid period)
        [i(F, [c('70', [u, T])]), true, d('1994-12-26')], //  female, 28/25, general ❌, teacher ✅ (in valid period)
        [i(F, [c('75', [u, T])]), false, d('1999-12-26')], // female, 28/28, general ❌, teacher ❌ (after valid period)
        [i(F, [c('65', [u, T])]), true, d('1989-12-26')], //  female, 25/25, general ✅, teacher ✅ (in valid period)
      ])(
        'should calculate possibility result',
        (input, qualified, expected) => {
          const [ok, { reached }] = integral.execute(input)
          expect(ok).toBe(qualified)
          expect(reached).toEqual(expected)
        }
      )
    })

    describe('proportional', () => {
      describe('conditions', () => {
        const [contribution, age] = proportional.conditions

        /**
         * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
         * com proventos proporcionais a esse tempo;
         */
        it.each([
          // male
          [i(M, [c('67')]), d('1996-12-24')],
          [i(M, [c('69')]), d('1998-12-25')],
          // female
          [i(F, [c('72')]), d('1996-12-25')],
          [i(F, [c('74')]), d('1998-12-26')],
        ])('should reach by contribution', (input, expected) => {
          const [reached] = contribution.execute(input)
          expect(reached).toEqual(expected)
        })

        /**
         * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
         * com proventos proporcionais ao tempo de serviço.
         */
        it.each([
          // male
          [i(M, [], d('1932')), d('1997')],
          [i(M, [], d('1934')), d('1999')],
          // female
          [i(F, [], d('1937')), d('1997')],
          [i(F, [], d('1939')), d('1999')],
        ])('should reach by age', (input, expecte) => {
          const [reached] = age.execute(input)
          expect(reached).toEqual(expecte)
        })
      })

      it.each([
        // [i(M, [c('65')], d('50')), true, d('1994-12-25')], //   male, 30/48, general ✅, age ❌ (in valid period)
        // [i(M, [c('70')], d('50')), false, d('1999-12-25')], //  male, 28/48, general ❌, age ❌ (in valid period)
        // [i(M, [c('70')], d('30')), true, d('1995-01-01')], //   male, 28/65, general ❌, age ✅ (in valid period)
        // [i(M, [c('68')], d('30')), true, d('1995-01-01')], //   male, 30/65, general ✅, age ✅ (in valid period)

        [i(F, [c('70')], d('55')), true, d('1994-12-26')], //   female, 25/43, general ✅, age ❌ (in valid period)
        [i(F, [c('75')], d('55')), false, d('1999-12-26')], //  female, 23/43, general ❌, age ❌ (in valid period)
        [i(F, [c('75')], d('35')), true, d('1995-01-01')], //   female, 23/60, general ❌, age ✅ (in valid period)
        [i(F, [c('73')], d('35')), true, d('1995-01-01')], //   female, 25/60, general ✅, age ✅ (in valid period)
      ])(
        'should calculate possibility result',
        (input, qualified, expected) => {
          const [ok, { reached }] = proportional.execute(input)
          expect(ok).toBe(qualified)
          expect(reached).toEqual(expected)
        }
      )
    })
  })
})
