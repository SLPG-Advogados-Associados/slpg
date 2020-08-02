import { d, c } from '../../test-utils'
import { between, sum } from '../../duration'
import { TODAY } from '../../const'
import { split } from './utils'

describe('retirement/calculator/lib/reachers/contribution/utils', () => {
  describe('split', () => {
    it.each([
      [c('70^90'), d('60'), [c('70^90')]], // cut before, keep same
      [c('70^90'), d('00'), [c('70^90')]], // cut after, keep same
      [c('70^90'), d('80'), [c('70^80'), c('80^90')]], // cut between
      [c('70'), d('80'), [c('70^80'), c('80')]], // cut without end
    ])('should split conditions based on date', (input, date, expected) => {
      expect(split(date)(input)).toMatchObject(expected)

      const left = between(input.start, input.end || TODAY)
      // prettier-ignore
      const right = sum(...expected.map(c => between(c.start, c.end || TODAY)))

      // assert total duration is the same.
      expect(left).toEqual(right)
    })
  })
})
