/* cspell: disable */
import { Contribution, CalculatorInput } from '../../../types'
import { d, c, u } from '../../test-utils'
import { normalize, multiply } from '../../duration'
import { total } from './total'
import { filter } from './utils/processors'

describe('retirement/calculator/lib/reachers/contribution/total', () => {
  const i = (...contributions: Contribution[]) =>
    ({ contributions } as CalculatorInput)

  const r = (from: string, to?: string) => ({
    from: d(from),
    to: to ? d(to) : u,
  })

  describe('simple', () => {
    it.each([
      // single
      [i(c('70^90')), [r('1989-12-27', '1990')]],
      [i(c('70')), [r('1989-12-27')]],

      // multiple
      [i(c('60^65'), c('70^85')), [r('1984-12-26', '1985')]],
      [i(c('90^95'), c('2000')), [r('2014-12-27')]],
      [i(c('70^95'), c('2000')), [r('1989-12-27')]],

      // never satisfied
      [i(c('80^90')), []],
      [i(c('60^65'), c('70^75')), []],
    ])('should correctly calculate reach', (input, result) => {
      expect(total({ expected: { years: 20 } })(input)).toEqual(result)
    })
  })

  describe('filtered', () => {
    it.each([
      [i(c('70^80'), c('80')), []],
      [i(c('70^90'), c('90^00')), [r('1989-12-27', '1990')]],
      [i(c('70^80'), c('80^90'), c('90^00')), [r('1999-12-28', '2000')]],

      // posterior temporary is filtered out
      [i(c('70^'), c('80^90')), [r('1989-12-27')]],
    ])('should correctly calculate reach', (input, result) => {
      let curr = 0

      const reacher = total({
        expected: { years: 20 },
        // filter-in odd contributions (just to difeer)
        processors: { '^': filter(() => curr++ % 2 === 0) },
      })

      expect(reacher(input)).toEqual(result)
    })
  })

  describe('process', () => {
    it.each([
      [i(c('90^2000')), [r('1994-12-30', '2000')]],
      [i(c('92')), [r('1998-12-29')]],
      [i(c('92^93'), c('93')), [r('1998-12-29')]],
    ])('should be possible to process duration', (input, result) => {
      const reacher = total({
        expected: { years: 10 },
        processors: {
          // double duration until 95
          '^95': (duration) => normalize(multiply(2, duration)),
        },
      })

      expect(reacher(input)).toEqual(result)
    })
  })
})
