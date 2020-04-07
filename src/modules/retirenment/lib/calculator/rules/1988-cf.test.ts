/* cspell: disable */
import { c, d } from '../lib/test-utils'
import { NEVER } from '../lib/const'
import { Gender, Contribution, Post } from '../types'
import { conditions } from './1988-cf'

const { TEACHER } = Post
const { MALE: M, FEMALE: F } = Gender

describe('retirement/calculator/rules/cf-1998', () => {
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
        [i(M, [c('1962')]), true, d('1997')], //   ✅ +35 contribution years by 1998
        [i(M, [c('1964')]), false, d('1999')], //  ❌ -35 contribution years by 1998
        // female
        [i(F, [c('1967')]), true, d('1997')], //   ✅ +30 contribution years by 1998
        [i(F, [c('1969')]), false, d('1999')], //  ❌ -30 contribution years by 1998
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
        [i(M, [c('1967', [null, TEACHER])]), true, d('1997')], //   ✅ +30 contribution years by 1998
        [i(M, [c('1969', [null, TEACHER])]), false, d('1999')], //  ❌ -30 contribution years by 1998
        // female teacher
        [i(F, [c('1972', [null, TEACHER])]), true, d('1997')], //   ✅ +25 contribution years by 1998
        [i(F, [c('1974', [null, TEACHER])]), false, d('1999')], //  ❌ -25 contribution years by 1998
        // non-teacher
        [i(M, [c('1960')]), false, NEVER], //   ✅ not-teacher
        [i(F, [c('1960')]), false, NEVER], //  ❌ not-teacher
        // mixed post types
        [i(M, [c('1960^1970'), c('1970', [null, TEACHER])]), false, d('2000')], //  ❌ -30 contribution years by 1998
        [i(M, [c('1960^1967'), c('1967', [null, TEACHER])]), true, d('1997')], //   ✅ +30 contribution years by 1998
        [i(M, [c('1960^1967'), c('1969', [null, TEACHER])]), false, d('1999')], //  ❌ -30 contribution years by 1998

        [i(F, [c('1960^1975'), c('1975', [null, TEACHER])]), false, d('2000')], //  ❌ -25 contribution years by 1998
        [i(F, [c('1960^1972'), c('1972', [null, TEACHER])]), true, d('1997')], //   ✅ +25 contribution years by 1998
        [i(F, [c('1960^1972'), c('1974', [null, TEACHER])]), false, d('1999')], //  ❌ -25 contribution years by 1998
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
        [i(M, [c('1967')]), true, d('1997')], //   ✅ +30 contribution years by 1998
        [i(M, [c('1969')]), false, d('1999')], //  ❌ -30 contribution years by 1998
        // female
        [i(F, [c('1972')]), true, d('1997')], //   ✅ +25 contribution years by 1998
        [i(F, [c('1974')]), false, d('1999')], //  ❌ -25 contribution years by 1998
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
