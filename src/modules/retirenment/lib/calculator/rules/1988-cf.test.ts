/* cspell: disable */
import { c, d } from '../lib/test-utils'
import { NEVER } from '../lib/const'
import { Gender, Contribution, Post } from '../types'
import { conditions } from './1988-cf'

const { TEACHER } = Post
const { MALE: M, FEMALE: F } = Gender

describe('retirement/calculator/rules/cf-1988', () => {
  describe('conditions', () => {
    const [condA, condB, condC, condD] = conditions

    const i = (
      gender: Gender,
      contributions: Contribution[],
      birthDate: Date = new Date('1940')
    ) => ({
      gender,
      birthDate,
      contributions,
    })

    /**
     * a) aos trinta e cinco anos de serviço, se homem, e aos trinta, se mulher,
     * com proventos integrais;
     */
    describe('a)', () => {
      it.each([
        // male
        [i(M, [c('63')]), true, d('1997-12-23')], //   ✅ +35 contribution years by 1998
        [i(M, [c('64')]), false, d('1998-12-23')], //  ❌ -35 contribution years by 1998
        // female
        [i(F, [c('67')]), true, d('1996-12-24')], //   ✅ +30 contribution years by 1998
        [i(F, [c('69')]), false, d('1998-12-25')], //  ❌ -30 contribution years by 1998
      ])('should check qualification', (input, qualified, by) => {
        const [reached, context] = condA(input)
        expect(reached).toEqual(qualified)
        expect(context.reached).toEqual(by)
        expect(context.integrality).toBe(true)
      })
    })

    /**
     * b) aos trinta anos de efetivo exercício em funções de magistério, se
     * professor, e vinte e cinco, se professora, com proventos integrais;
     */
    describe('b)', () => {
      it.each([
        // male teacher
        [i(M, [c('67', [null, TEACHER])]), true, d('1996-12-24')], //   ✅ +30 contribution years by 1998
        [i(M, [c('69', [null, TEACHER])]), false, d('1998-12-25')], //  ❌ -30 contribution years by 1998
        // female teacher
        [i(F, [c('72', [null, TEACHER])]), true, d('1996-12-25')], //   ✅ +25 contribution years by 1998
        [i(F, [c('74', [null, TEACHER])]), false, d('1998-12-26')], //  ❌ -25 contribution years by 1998
        // non-teacher
        [i(M, [c('60')]), false, NEVER], //  ✅ not-teacher
        [i(F, [c('60')]), false, NEVER], //  ❌ not-teacher
        // mixed post types
        [i(M, [c('60^70'), c('70', [null, TEACHER])]), false, d('1999-12-25')], //  ❌ -30 contribution years by 1998
        [i(M, [c('60^67'), c('67', [null, TEACHER])]), true, d('1996-12-24')], //   ✅ +30 contribution years by 1998
        [i(M, [c('60^67'), c('69', [null, TEACHER])]), false, d('1998-12-25')], //  ❌ -30 contribution years by 1998

        [i(F, [c('60^75'), c('75', [null, TEACHER])]), false, d('1999-12-26')], //  ❌ -25 contribution years by 1998
        [i(F, [c('60^72'), c('72', [null, TEACHER])]), true, d('1996-12-25')], //   ✅ +25 contribution years by 1998
        [i(F, [c('60^72'), c('74', [null, TEACHER])]), false, d('1998-12-26')], //  ❌ -25 contribution years by 1998
      ])('should check qualification', (input, qualified, by) => {
        const [reached, context] = condB(input)
        expect(reached).toEqual(qualified)
        expect(context.reached).toEqual(by)
        expect(context.integrality).toBe(true)
      })
    })

    /**
     * c) aos trinta anos de serviço, se homem, e aos vinte e cinco, se mulher,
     * com proventos proporcionais a esse tempo;
     */
    describe('c)', () => {
      it.each([
        // male
        [i(M, [c('67')]), true, d('1996-12-24')], //   ✅ +30 contribution years by 1998
        [i(M, [c('69')]), false, d('1998-12-25')], //  ❌ -30 contribution years by 1998
        // female
        [i(F, [c('72')]), true, d('1996-12-25')], //   ✅ +25 contribution years by 1998
        [i(F, [c('74')]), false, d('1998-12-26')], //  ❌ -25 contribution years by 1998
      ])('should check qualification', (input, qualified, by) => {
        const [reached, context] = condC(input)
        expect(reached).toEqual(qualified)
        expect(context.reached).toEqual(by)
        expect(context.integrality).toBe(false)
      })
    })

    /**
     * d) aos sessenta e cinco anos de idade, se homem, e aos sessenta, se mulher,
     * com proventos proporcionais ao tempo de serviço.
     */
    describe('d)', () => {
      it.each([
        // male
        [i(M, [], d('1932')), true, d('1997')], //   ✅ +65 years old by 1998
        [i(M, [], d('1934')), false, d('1999')], //  ❌ -65 years old by 1998
        // female
        [i(F, [], d('1937')), true, d('1997')], //   ✅ +60 years old by 1998
        [i(F, [], d('1939')), false, d('1999')], //  ❌ -60 years old by 1998
      ])('should check qualification', (input, qualified, by) => {
        const [reached, context] = condD(input)
        expect(reached).toEqual(qualified)
        expect(context.reached).toEqual(by)
        expect(context.integrality).toBe(false)
      })
    })
  })
})
