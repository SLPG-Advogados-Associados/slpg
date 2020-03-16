/* cspell: disable */
import { Gender, Post, ServiceKind } from '../types'
import { conditions } from './1998-ec-20-transition'

const { MALE: M, FEMALE: F } = Gender

/**
 * Generates a valid cf-1988 rule input.
 */
const getInput = (
  gender: Gender,
  birth: string,
  contributions: [string, string?, number?, boolean?][]
  // teacher: boolean
) => ({
  gender,
  // teacher,
  birthDate: new Date(birth),
  contributions: contributions.map(
    ([start, end, salary = 1000, teacher = false]) => ({
      salary,
      service: {
        kind: ServiceKind.PUBLIC,
        post: teacher ? Post.TEACHER : Post.OTHER,
      },
      start: new Date(start),
      end: end ? new Date(end) : undefined,
    })
  ),
})

describe('retirement/calculator/rules/1998-ec-20-transition', () => {
  describe('conditions', () => {
    /**
     * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
     * de idade, se mulher;
     *
     * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
     * aposentadoria;
     *
     * III - contar tempo de contribuição igual, no mínimo, à soma de:
     *
     * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
     *
     * b) um período adicional de contribuição equivalente a vinte por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior.
     */
    describe('integral', () => {
      const condition = conditions[0]

      it.each([
        // male
        [getInput(M, '1949', [['1967', '1977'], ['1977']]), true], //   male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [getInput(M, '1951', [['1967', '1977'], ['1977']]), false], //  male, 52 ❌, contributing 36 ✅, last more than 5 ✅
        [getInput(M, '1949', [['1967', '1977'], ['1979']]), false], //  male, 54 ✅, contributing 34 ❌, last more than 5 ✅
        [getInput(M, '1949', [['1967', '2000'], ['2000']]), false], //  male, 54 ✅, contributing 36 ✅, last less than 5 ❌
        // female
        [getInput(F, '1954', [['1972', '1977'], ['1977']]), true], //   female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [getInput(F, '1956', [['1972', '1977'], ['1977']]), false], //  female, 47 ❌, contributing 31 ✅, last more than 5 ✅
        [getInput(F, '1954', [['1972', '1977'], ['1979']]), false], //  female, 49 ✅, contributing 29 ❌, last more than 5 ✅
        [getInput(F, '1954', [['1972', '2000'], ['2000']]), false], //  female, 49 ✅, contributing 31 ✅, last less than 5 ❌
      ])('should check qualification', (input, satisfied) => {
        expect(condition(input)[0]).toBe(satisfied)
      })

      // prettier-ignore
      it('should be always integral', () => {
        expect(condition(getInput(M, '1950', [['1965']]))[1].integrality).toBe(true)
        expect(condition(getInput(M, '1950', [['1980']]))[1].integrality).toBe(true)
      })
    })

    /**
     * § 1º - O servidor de que trata este artigo, desde que atendido o disposto
     * em seus incisos I e II, e observado o disposto no art. 4º desta Emenda,
     * pode aposentar-se com proventos proporcionais ao tempo de contribuição,
     * quando atendidas as seguintes condições;
     *
     * I - contar tempo de contribuição igual, no mínimo, à soma de:
     *
     * a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
     *
     * b) um período adicional de contribuição equivalente a quarenta por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior;
     */
    describe('proportional', () => {
      const condition = conditions[1]

      it.each([
        // male
        [getInput(M, '1949', [['1967', '1977'], ['1982']]), true], //   male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [getInput(M, '1951', [['1967', '1977'], ['1982']]), false], //  male, 52 ❌, contributing 31 ✅, last more than 5 ✅
        [getInput(M, '1949', [['1967', '1977'], ['1984']]), false], //  male, 54 ✅, contributing 29 ❌, last more than 5 ✅
        [getInput(M, '1949', [['1967', '1995'], ['2000']]), false], //  male, 54 ✅, contributing 31 ✅, last less than 5 ❌
        // female
        [getInput(F, '1954', [['1972', '1977'], ['1982']]), true], //   female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [getInput(F, '1956', [['1972', '1977'], ['1982']]), false], //  female, 47 ❌, contributing 26 ✅, last more than 5 ✅
        [getInput(F, '1954', [['1972', '1977'], ['1984']]), false], //  female, 49 ✅, contributing 24 ❌, last more than 5 ✅
        [getInput(F, '1954', [['1972', '1995'], ['2000']]), false], //  female, 49 ✅, contributing 26 ✅, last less than 5 ❌
      ])('should check qualification', (input, satisfied) => {
        expect(condition(input)[0]).toBe(satisfied)
      })

      // prettier-ignore
      it('should be always NOT integral', () => {
        expect(condition(getInput(M, '1950', [['1965']]))[1].integrality).toBe(false)
        expect(condition(getInput(M, '1950', [['1990']]))[1].integrality).toBe(false)
      })
    })
  })
})
