/* cspell: disable */
import { CalculatorInput } from '../../../types'
import { c, r } from '../../test-utils'
import { normalize, multiply } from '../../duration'
import { total } from './total'
import { filter } from './utils/processors'

describe('retirement/calculator/lib/reachers/contribution/total', () => {
  const i = (spans: string[]) =>
    ({ contributions: spans.map((span) => c(span)) } as CalculatorInput)

  describe('simple', () => {
    it.each([
      // single
      [['70^90'], ['1989-12-27^']],
      [['70'], ['1989-12-27^']],

      // multiple
      [['60^65', '70^85'], ['1984-12-26^']],
      [['90^95', '2000'], ['2014-12-27^']],
      [['70^95', '2000'], ['1989-12-27^']],

      // never satisfied
      [['80^90'], []],
      [['60^65', '70^75'], []],
    ])('should correctly calculate reach', (input, result) => {
      expect(total({ expected: { years: 20 } })(i(input))).toEqual(
        result.map(r)
      )
    })
  })

  describe('filtered', () => {
    it.each([
      [['70^80', '80'], []],
      [['70^90', '90^00'], ['1989-12-27^']],
      [['70^80', '80^90', '90^00'], ['1999-12-28^']],

      // posterior temporary is filtered out
      [['70^', '80^90'], ['1989-12-27^']],
    ])('should correctly calculate reach', (input, result) => {
      let curr = 0

      const reacher = total({
        expected: { years: 20 },
        // filter-in odd contributions (just to difeer)
        processors: { '^': filter(() => curr++ % 2 === 0) },
      })

      expect(reacher(i(input))).toEqual(result.map(r))
    })
  })

  describe('process', () => {
    it.each([
      [['90^2000'], ['1994-12-30^']],
      [['92'], ['1998-12-29^']],
      [['92^93', '93'], ['1998-12-29^']],
    ])('should be possible to process duration', (input, result) => {
      const reacher = total({
        expected: { years: 10 },
        processors: {
          // double duration until 95
          '^95': (duration) => normalize(multiply(2, duration)),
        },
      })

      expect(reacher(i(input))).toEqual(result.map(r))
    })
  })
})
