/* cspell: disable */
import { c, d, u } from '../lib/test-utils'
import { NEVER } from '../lib/const'
import { Gender, Contribution, Post } from '../types'
import { rule } from './1988-cf'

const { TEACHER: T } = Post
const { MALE: M, FEMALE: F } = Gender

describe('retirement/calculator/rules/cf-1988', () => {
  describe('conditions', () => {
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
      const [general, teacher] = integral.conditions

      /**
       * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
       * com proventos integrais;
       */
      describe('a)', () => {
        it.each([
          // male
          [i(M, [c('63')]), d('1997-12-23')],
          [i(M, [c('64')]), d('1998-12-23')],
          [i(M, [c('1980')]), d('2014-12-23')],
          // female
          [i(F, [c('67')]), d('1996-12-24')],
          [i(F, [c('69')]), d('1998-12-25')],
          [i(F, [c('1980')]), d('2009-12-24')],
        ])('should check qualification', (input, expected) => {
          const [reached] = general.execute(input)
          expect(reached).toEqual(expected)
        })
      })

      /**
       * b) aos trinta anos de efetivo exercício em funções de magistério, se
       * professor, e vinte e cinco, se professora, com proventos integrais;
       */
      describe('b)', () => {
        it.each([
          // male teacher
          [i(M, [c('67', [u, T])]), d('1996-12-24')], //
          [i(M, [c('69', [u, T])]), d('1998-12-25')],

          // female teacher
          [i(F, [c('72', [u, T])]), d('1996-12-25')],
          [i(F, [c('74', [u, T])]), d('1998-12-26')],

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
        ])('should check qualification', (input, expected) => {
          const [reached] = teacher.execute(input)
          expect(reached).toEqual(expected)
        })
      })
    })

    describe('proportional', () => {
      const [contribution, age] = proportional.conditions

      /**
       * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
       * com proventos proporcionais a esse tempo;
       */
      describe('c)', () => {
        it.each([
          // male
          [i(M, [c('67')]), d('1996-12-24')],
          [i(M, [c('69')]), d('1998-12-25')],
          // female
          [i(F, [c('72')]), d('1996-12-25')],
          [i(F, [c('74')]), d('1998-12-26')],
        ])('should check qualification', (input, expected) => {
          const [reached] = contribution.execute(input)
          expect(reached).toEqual(expected)
        })
      })

      /**
       * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
       * com proventos proporcionais ao tempo de serviço.
       */
      describe('d)', () => {
        it.each([
          // male
          [i(M, [], d('1932')), d('1997')],
          [i(M, [], d('1934')), d('1999')],
          // female
          [i(F, [], d('1937')), d('1997')],
          [i(F, [], d('1939')), d('1999')],
        ])('should check qualification', (input, expecte) => {
          const [reached] = age.execute(input)
          expect(reached).toEqual(expecte)
        })
      })
    })
  })
})
