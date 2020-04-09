/* cspell: disable */
import { Gender, Post, Contribution, ServiceKind } from '../types'
import { d, c, u } from '../lib/test-utils'
import { between, string } from '../lib/duration'
// @ts-ignore
import { conditions, rule, __get__, __set__ } from './1998-ec-20-transition'

const { MALE: M, FEMALE: F } = Gender
const { TEACHER: T, OTHER: O } = Post

/**
 * Generates a valid 1998-ec-20-transition rule input.
 */
const i = (gender: Gender, birth: string, contributions: Contribution[]) => ({
  gender,
  birthDate: d(birth),
  contributions,
})

describe('retirement/calculator/rules/1998-ec-20-transition', () => {
  describe('processor', () => {
    const { split, process } = __get__('processor')

    it.each([
      // before promulgation
      [c('1960^1980'), [c('1960^1980')]],
      [c('1960^1980'), [c('1960^1980')]],
      // after promulgation
      [c('2000^2010'), [c('2000^2010')]],
      [c('2000^2010'), [c('2000^2010')]],
      // between promulgation
      [c('1990^2010'), [c('1990^1998-12-16'), c('1998-12-16^2010')]],
      [c('1990^2010'), [c('1990^1998-12-16'), c('1998-12-16^2010')]],
    ])('should split contributions', (input, expected) => {
      expect(split(input)).toEqual(expected)
    })

    it.each([
      // before promulgation
      [c('1960^1980', [u, O]), M, 'P7305D'], // 5D = leap years
      [c('1960^1980', [u, T]), M, 'P8546DT20H24M'], // 7305 * 1.17
      // after promulgation
      [c('2000^2010', [u, O]), M, 'P3653D'], // 3D = leap years
      [c('2000^2010', [u, T]), M, 'P3653D'], // 3D = leap years, after 1998 activation
    ])('should process contributions', (contribution, gender, expected) => {
      const { start, end } = contribution
      const context = { contribution, input: { gender } }
      const duration = between(start, end)

      expect(string(process(duration, context))).toBe(expected)
    })
  })

  describe('conditions', () => {
    const [integral, proportional] = conditions

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
      it.each([
        // reached before promulgation:
        [i(M, '40', [c('50')]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
        [i(F, '40', [c('50')]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

        // male

        // by contrib:
        [i(M, '49', [c('57^67'), c('78')]), true, d('2002-12-24')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [i(M, '49', [c('57^67'), c('80')]), false, d('2004-12-23')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
        // by age:
        [i(M, '49', [c('57^67'), c('70')]), true, d('2002-01-01')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [i(M, '51', [c('57^67'), c('70')]), false, d('2004-01-01')], // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
        // by last:
        [i(M, '49', [c('57^00'), c('00')]), false, d('2004-12-30')], // male, 54 ✅, contributing 36 ✅, last less than 5 ❌

        // female

        // by contrib:
        [i(F, '54', [c('57^62'), c('78')]), true, d('2002-12-25')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [i(F, '54', [c('57^62'), c('80')]), false, d('2004-12-24')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
        // by age:
        [i(F, '54', [c('57^62'), c('70')]), true, d('2002-01-01')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [i(F, '56', [c('57^62'), c('70')]), false, d('2004-01-01')], // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
        // by last:
        [i(F, '54', [c('57^00'), c('00')]), false, d('2004-12-30')], // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
      ])('should calculate condition result', (input, satisfied, by) => {
        const [reached, context] = integral(input)
        expect(reached).toBe(satisfied)
        expect(context).toMatchObject({ integrality: true, reached: by })
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
      it.each([
        // reached before promulgation:
        [i(M, '40', [c('50')]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
        [i(F, '40', [c('50')]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

        // male

        // by contrib:
        [i(M, '49', [c('57^67'), c('83')]), true, d('2002-12-25')], //  male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [i(M, '49', [c('57^67'), c('85')]), false, d('2004-12-25')], // male, 54 ✅, contributing 29 ❌, last more than 5 ✅
        // by age:
        [i(M, '49', [c('57^67'), c('75')]), true, d('2002-01-01')], //  male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [i(M, '51', [c('57^67'), c('75')]), false, d('2004-01-01')], // male, 52 ❌, contributing 31 ✅, last more than 5 ✅
        // by last:
        [i(M, '49', [c('57^00'), c('00')]), false, d('2004-12-30')], // male, 54 ✅, contributing 31 ✅, last less than 5 ❌

        // female

        // by contrib:
        [i(F, '54', [c('57^62'), c('83')]), true, d('2002-12-26')], //  female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [i(F, '54', [c('57^62'), c('85')]), false, d('2004-12-26')], // female, 49 ✅, contributing 24 ❌, last more than 5 ✅
        // by age:
        [i(F, '54', [c('57^62'), c('75')]), true, d('2002-01-01')], //  female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [i(F, '56', [c('57^62'), c('75')]), false, d('2004-01-01')], // female, 47 ❌, contributing 26 ✅, last more than 5 ✅
        // by last:
        [i(F, '54', [c('57^00'), c('00')]), false, d('2004-12-30')], // female, 49 ✅, contributing 26 ✅, last less than 5 ❌
      ])('should calculate condition result', (input, satisfied, by) => {
        const [reached, context] = proportional(input)
        expect(reached).toBe(satisfied)
        expect(context).toMatchObject({ integrality: false, reached: by })
      })
    })

    /*
     * § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
     * dos Municípios, incluídas suas autarquias e fundações, que, até a data da
     * publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
     * de magistério e que opte por aposentar-se na forma do disposto no
     * "caput", terá o tempo de serviço exercido até a publicação desta Emenda
     * contado com o acréscimo de dezessete por cento, se homem, e de vinte por
     * cento, se mulher, desde que se aposente, exclusivamente, com tempo de
     * efetivo exercício das funções de magistério.
     */
    describe('teacher', () => {
      const y = [u, T] as [ServiceKind, Post]
      const n = [u, u] as [ServiceKind, Post]

      describe('integral', () => {
        it.each([
          // reached before promulgation:
          [i(M, '40', [c('50', y)]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
          [i(F, '40', [c('50', y)]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

          // male

          // by contrib:
          [i(M, '49', [c('60^65', y), c('78', y)]), true, d('2003-07-25')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [i(M, '49', [c('60^65', y), c('80', y)]), false, d('2005-11-25')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          [i(M, '49', [c('60^65', n), c('80', y)]), false, d('2006-10-02')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // by age:
          [i(M, '49', [c('57^67', y), c('70', y)]), true, d('2002-01-01')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [i(M, '51', [c('57^67', y), c('70', y)]), false, d('2004-01-01')], // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
          // by last:
          [i(M, '49', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // male, 54 ✅, contributing 36 ✅, last less than 5 ❌

          // female

          // by contrib:
          [i(F, '54', [c('60^65', y), c('82', y)]), true, d('2002-08-03')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [i(F, '54', [c('60^65', y), c('84', y)]), false, d('2004-12-26')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          [i(F, '54', [c('60^65', n), c('84', y)]), false, d('2005-12-26')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          // by age:
          [i(F, '54', [c('60^65', y), c('70', y)]), true, d('2002-01-01')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [i(F, '56', [c('60^65', y), c('70', y)]), false, d('2004-01-01')], // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
          // by last:
          [i(F, '54', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
        ])('should calculate condition result', (input, satisfied, by) => {
          const [reached, context] = integral(input)
          expect(reached).toBe(satisfied)
          expect(context).toMatchObject({ integrality: true, reached: by })
        })
      })

      describe('proportional', () => {
        it.todo('should calculate condition result')
        it.todo('should be never integral')
        it.todo('should return correct reached date')
      })
    })
  })
})
