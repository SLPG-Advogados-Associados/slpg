import { expected, parse } from '../lib/test-utils'
import { rule } from './1988-cf.engine'

describe('retirement/calculator/rules/cf-1988.engine', () => {
  describe('Possibilidades', () => {
    const [integral, proportional] = rule.possibilities

    describe('Integral', () => {
      it.each([
        // male
        ['homem | contribuinte desde 60', ['1994-12-23', '1994-12-23']], //  38/00, general ✅, teacher ❌ (in valid period)
        ['homem | contribuinte desde 65', [null, '1999-12-24']], //                    33/00, general ❌, teacher ❌ (in valid period)
        // teacher
        ['homem | professor desde 65', ['1994-12-25', '1994-12-25']], //               33/30, general ❌, teacher ✅ (in valid period)
        ['homem | professor desde 70', [null, '1999-12-25']], //                       28/28, general ❌, teacher ❌ (after valid period)
        ['homem | professor desde 60', ['1989-12-24', '1989-12-24']], //               30/30, general ✅, teacher ✅ (in valid period)

        // female
        ['mulher | contribuinte desde 65', ['1994-12-25', '1994-12-25']], //           33/00, general ✅, teacher ❌ (in valid period)
        ['mulher | contribuinte desde 70', [null, '1999-12-25']], //                   28/00, general ❌, teacher ❌ (in valid period)
        // teacher
        ['mulher | professora desde 70', ['1994-12-26', '1994-12-26']], //             28/25, general ❌, teacher ✅ (in valid period)
        ['mulher | professora desde 75', [null, '1999-12-26']], //                     28/28, general ❌, teacher ❌ (after valid period)
        ['mulher | professora desde 65', ['1989-12-26', '1989-12-26']], //             25/25, general ✅, teacher ✅ (in valid period)
      ])('should calculate possibility result', (input, output) => {
        const parsed = integral.requisites.execute(parse(input))
        expect(parsed).toMatchObject(expected(output))
      })
    })

    describe('Proporcional', () => {
      // prettier-ignore
      it.each([
        ['homem | nascido em 50 | contribuinte desde 65', ['1994-12-25', '1994-12-25']], //   30/48, general ✅, age ❌ (in valid period)
        ['homem | nascido em 50 | contribuinte desde 70', [ null, '1999-12-25']], //          28/48, general ❌, age ❌ (in valid period)
        ['homem | nascido em 30 | contribuinte desde 70', ['1995-01-01', '1999-12-25']], //   28/65, general ❌, age ✅ (in valid period)
        ['homem | nascido em 30 | contribuinte desde 68', ['1995-01-01', '1997-12-24']], //   30/65, general ✅, age ✅ (in valid period)

        ['mulher | nascida em 55 | contribuinte desde 70', ['1994-12-26', '1994-12-26']], //  25/43, general ✅, age ❌ (in valid period)
        ['mulher | nascida em 55 | contribuinte desde 75', [null, '1999-12-26']], //          23/43, general ❌, age ❌ (in valid period)
        ['mulher | nascida em 35 | contribuinte desde 75', ['1995-01-01', '1999-12-26']], //  23/60, general ❌, age ✅ (in valid period)
        ['mulher | nascida em 35 | contribuinte desde 73', ['1995-01-01', '1997-12-26']], //  25/60, general ✅, age ✅ (in valid period)
      ])('should calculate possibility result', (input, output) => {
        const parsed = proportional.requisites.execute(parse(input))
        expect(parsed).toMatchObject(expected(output))
      })
    })
  })
})
