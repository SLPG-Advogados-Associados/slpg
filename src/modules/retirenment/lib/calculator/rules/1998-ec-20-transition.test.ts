/* cspell: disable */
import { d, c, u, I } from '../lib/test-utils'
import { between, string } from '../lib/duration'
import { NEVER } from '../lib/const'
import { Gender, Post, ServiceKind, CalculatorInput } from '../types'
// @ts-ignore
import { rule, __get__ } from './1998-ec-20-transition'

const { MALE: M, FEMALE: F } = Gender
const { TEACHER: T, OTHER: O } = Post

describe('retirement/calculator/rules/1998-ec-20-transition', () => {
  describe('processor', () => {
    const processor = __get__('processor')
    // not unit testing for 20%/40% toll.
    const { split, process } = processor()

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

  describe('possibilities', () => {
    const [integral, proportional] = rule.possibilities

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
      describe('conditions', () => {
        const [age, last, total] = integral.conditions

        /**
         * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
         * de idade, se mulher;
         */
        it.each([
          [d('1950'), M, d('2003')],
          [d('1950'), F, d('1998')],
        ])('should reach by age', (birthDate, gender, reached) => {
          const input = { birthDate, gender } as CalculatorInput
          expect(age.execute(input)).toEqual([reached, { reachable: false }])
        })

        /**
         * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
         * aposentadoria;
         */
        it.each([
          // single
          [[c('2000')], d('2004-12-30')],
          [[c('2000^2005')], d('2004-12-30')],
          [[c('2000^2004-12-30')], d('2004-12-30')],
          // @ts-ignore
          [[c('2000^2003')], expect.not.toBeValidDate()],

          // multiple
          [[c('50^60'), c('2000')], d('2004-12-30')],
          [[c('50^60'), c('2000^2005')], d('2004-12-30')],
          [[c('50^60'), c('2000^2004-12-30')], d('2004-12-30')],
          // @ts-ignore
          [[c('50^60'), c('2000^2003')], expect.not.toBeValidDate()],
        ])('should reach by last post', (contributions, reached) => {
          const input = { contributions } as CalculatorInput
          expect(last.execute(input)).toEqual([reached, { reachable: false }])
        })

        /**
         * III - contar tempo de contribuição igual, no mínimo, à soma de:
         *
         * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
         *
         * b) um período adicional de contribuição equivalente a vinte por cento do
         * tempo que, na data da publicação desta Emenda, faltaria para atingir o
         * limite de tempo constante da alínea anterior.
         */
        it.each([
          [[c('2000')], M, NEVER],
          [[c('1950')], M, d('1984-12-23')],
          [[c('50^60'), c('70')], M, d('1994-12-24')],

          [[c('2000')], F, NEVER],
          [[c('1950')], F, d('1979-12-25')],
          [[c('50^60'), c('70')], F, d('1989-12-25')],

          // teacher

          [[c('2000', [u, T])], M, NEVER],
          [[c('1950', [u, T])], M, d('1976-08-27')],
          [[c('50^60'), c('70', [u, T])], M, d('1990-01-21')],

          [[c('2000', [u, T])], F, NEVER],
          [[c('1950', [u, T])], F, d('1970-03-11')],
          [[c('50^60'), c('70', [u, T])], F, d('1984-03-11')],
        ])(
          'should reach by contributions',
          (contributions, gender, expected) => {
            const input = { contributions, gender } as CalculatorInput
            const [reached] = total.execute(input)
            expect(reached).toEqual(expected)
          }
        )
      })

      it.each([
        // reached before promulgation:
        [I(M, '40', [c('50')]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
        [I(F, '40', [c('50')]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

        // male

        // by contrib:
        [I(M, '49', [c('57^67'), c('78')]), true, d('2003-10-14')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [I(M, '49', [c('57^67'), c('80')]), false, d('2006-03-08')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
        // by age:
        [I(M, '49', [c('57^67'), c('70')]), true, d('2002-01-01')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [I(M, '51', [c('57^67'), c('70')]), false, d('2004-01-01')], // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
        // by last:
        [I(M, '49', [c('57^00'), c('00')]), false, d('2004-12-30')], // male, 54 ✅, contributing 36 ✅, last less than 5 ❌

        // female

        // by contrib:
        [I(F, '54', [c('57^62'), c('78')]), true, d('2003-10-15')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [I(F, '54', [c('57^62'), c('80')]), false, d('2006-03-09')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
        // by age:
        [I(F, '54', [c('57^62'), c('70')]), true, d('2002-01-01')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [I(F, '56', [c('57^62'), c('70')]), false, d('2004-01-01')], // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
        // by last:
        [I(F, '54', [c('57^00'), c('00')]), false, d('2004-12-30')], // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
      ])('should calculate possibility result', (input, satisfied, by) => {
        const [reached, context] = integral.execute(input)
        expect(reached).toBe(satisfied)
        expect(context).toMatchObject({ reached: by })
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

        it.each([
          // reached before promulgation:
          [I(M, '40', [c('50', y)]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
          [I(F, '40', [c('50', y)]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

          // male

          // by contrib:
          [I(M, '49', [c('60^65', y), c('77', y)]), true, d('2003-01-30')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [I(M, '49', [c('60^65', y), c('78', y)]), false, d('2004-06-26')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // combined teacher/non-teacher periods
          [I(M, '49', [c('60^65', n), c('78', y)]), false, d('2005-07-03')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // by age:
          [I(M, '49', [c('57^67', y), c('70', y)]), true, d('2002-01-01')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [I(M, '51', [c('57^67', y), c('70', y)]), false, d('2004-01-01')], // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
          // by last:
          [I(M, '49', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // male, 54 ✅, contributing 36 ✅, last less than 5 ❌

          // female

          // by contrib:
          [I(F, '54', [c('60^65', y), c('82', y)]), true, d('2003-04-25')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [I(F, '54', [c('60^65', y), c('83', y)]), false, d('2004-10-02')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          [I(F, '54', [c('60^65', n), c('83', y)]), false, d('2005-12-14')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          // by age:
          [I(F, '54', [c('60^65', y), c('70', y)]), true, d('2002-01-01')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [I(F, '56', [c('60^65', y), c('70', y)]), false, d('2004-01-01')], // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
          // by last:
          [I(F, '54', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
        ])('should calculate possibility result', (input, satisfied, by) => {
          const [reached, context] = integral.execute(input)
          expect(reached).toBe(satisfied)
          expect(context).toMatchObject({ reached: by })
        })
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
      describe('conditions', () => {
        const [age, last, total] = proportional.conditions

        /**
         * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
         * de idade, se mulher;
         */
        it.each([
          [d('1950'), M, d('2003')],
          [d('1950'), F, d('1998')],
        ])('should reach by age', (birthDate, gender, reached) => {
          const input = { birthDate, gender } as CalculatorInput
          expect(age.execute(input)).toEqual([reached, { reachable: false }])
        })

        /**
         * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
         * aposentadoria;
         */
        it.each([
          // single
          [[c('2000')], d('2004-12-30')],
          [[c('2000^2005')], d('2004-12-30')],
          [[c('2000^2004-12-30')], d('2004-12-30')],
          // @ts-ignore
          [[c('2000^2003')], expect.not.toBeValidDate()],

          // multiple
          [[c('50^60'), c('2000')], d('2004-12-30')],
          [[c('50^60'), c('2000^2005')], d('2004-12-30')],
          [[c('50^60'), c('2000^2004-12-30')], d('2004-12-30')],
          // @ts-ignore
          [[c('50^60'), c('2000^2003')], expect.not.toBeValidDate()],
        ])('should reach by last post', (contributions, reached) => {
          const input = { contributions } as CalculatorInput
          expect(last.execute(input)).toEqual([reached, { reachable: false }])
        })

        /**
         * I - contar tempo de contribuição igual, no mínimo, à soma de:
         *
         * a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
         *
         * b) um período adicional de contribuição equivalente a quarenta por cento do
         * tempo que, na data da publicação desta Emenda, faltaria para atingir o
         * limite de tempo constante da alínea anterior;
         */
        it.each([
          [[c('2000')], M, NEVER],
          [[c('1950')], M, d('1979-12-25')],
          [[c('50^60'), c('70')], M, d('1989-12-25')],

          [[c('2000')], F, NEVER],
          [[c('1950')], F, d('1974-12-26')],
          [[c('50^60'), c('70')], F, d('1984-12-26')],

          // teacher

          [[c('2000', [u, T])], M, NEVER],
          [[c('1950', [u, T])], M, d('1971-08-29')],
          [[c('50^60'), c('70', [u, T])], M, d('1985-01-22')],

          [[c('2000', [u, T])], F, NEVER],
          [[c('1950', [u, T])], F, d('1965-03-12')],
          [[c('50^60'), c('70', [u, T])], F, d('1979-03-13')],
        ])(
          'should reach by contributions',
          (contributions, gender, expected) => {
            const input = { contributions, gender } as CalculatorInput
            const [reached] = total.execute(input)
            expect(reached).toEqual(expected)
          }
        )
      })

      it.each([
        // reached before promulgation:
        [I(M, '40', [c('50')]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
        [I(F, '40', [c('50')]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

        // male

        // by contrib:
        [I(M, '49', [c('60^70'), c('82')]), true, d('2003-03-11')], //  male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [I(M, '49', [c('60^70'), c('83')]), false, d('2004-08-03')], // male, 54 ✅, contributing 29 ❌, last more than 5 ✅
        // by age:
        [I(M, '49', [c('57^67'), c('75')]), true, d('2002-01-01')], //  male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [I(M, '51', [c('57^67'), c('75')]), false, d('2004-01-01')], // male, 52 ❌, contributing 31 ✅, last more than 5 ✅
        // by last:
        [I(M, '49', [c('57^00'), c('00')]), false, d('2004-12-30')], // male, 54 ✅, contributing 31 ✅, last less than 5 ❌

        // female

        // by contrib:
        [I(F, '54', [c('60^70'), c('87')]), true, d('2003-03-12')], //  female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [I(F, '54', [c('60^70'), c('88')]), false, d('2004-08-04')], // female, 49 ✅, contributing 24 ❌, last more than 5 ✅
        // by age:
        [I(F, '54', [c('57^62'), c('75')]), true, d('2002-01-01')], //  female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [I(F, '56', [c('57^62'), c('75')]), false, d('2004-01-01')], // female, 47 ❌, contributing 26 ✅, last more than 5 ✅
        // by last:
        [I(F, '54', [c('57^00'), c('00')]), false, d('2004-12-30')], // female, 49 ✅, contributing 26 ✅, last less than 5 ❌
      ])('should calculate possibility result', (input, satisfied, by) => {
        const [reached, context] = proportional.execute(input)
        expect(reached).toBe(satisfied)
        expect(context).toMatchObject({ reached: by })
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

        it.each([
          // reached before promulgation:
          [I(M, '40', [c('50', y)]), true, rule.promulgation], //  male,   58 ✅, contributing 48 ✅, last more than 5 ✅
          [I(F, '40', [c('50', y)]), true, rule.promulgation], //  female, 58 ✅, contributing 48 ✅, last more than 5 ✅

          // male

          // by contrib:
          [I(M, '49', [c('60^70', y), c('86', y)]), true, d('2003-04-29')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [I(M, '49', [c('60^70', y), c('87', y)]), false, d('2004-12-17')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // combined teacher/non-teacher periods
          [I(M, '49', [c('60^70', n), c('87', y)]), false, d('2007-05-06')], // male, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // by age:
          [I(M, '49', [c('57^67', y), c('70', y)]), true, d('2002-01-01')], //  male, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [I(M, '51', [c('57^67', y), c('70', y)]), false, d('2004-01-01')], // male, 52 ❌, contributing 36 ✅, last more than 5 ✅
          // by last:
          [I(M, '49', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // male, 54 ✅, contributing 36 ✅, last less than 5 ❌

          // female

          // by contrib:
          [I(F, '54', [c('60^65', y), c('86', y)]), true, d('2003-10-07')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [I(F, '54', [c('60^65', y), c('87', y)]), false, d('2005-06-11')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          [I(F, '54', [c('60^65', n), c('87', y)]), false, d('2006-11-05')], // female, 49 ✅, contributing 29 ❌, last more than 5 ✅
          // by age:
          [I(F, '54', [c('60^65', y), c('70', y)]), true, d('2002-01-01')], //  female, 49 ✅, contributing 31 ✅, last more than 5 ✅
          [I(F, '56', [c('60^65', y), c('70', y)]), false, d('2004-01-01')], // female, 47 ❌, contributing 31 ✅, last more than 5 ✅
          // by last:
          [I(F, '54', [c('57^00', y), c('00', y)]), false, d('2004-12-30')], // female, 49 ✅, contributing 31 ✅, last less than 5 ❌
        ])('should calculate possibility result', (input, satisfied, by) => {
          const [reached, context] = proportional.execute(input)
          expect(reached).toBe(satisfied)
          expect(context).toMatchObject({ reached: by })
        })
      })
    })
  })
})
