import { identity } from 'ramda'

import { d, c } from '../../../test-utils'
import { parseInterval } from '../../../date'
import { between, sum } from '../../../duration'
import { TODAY } from '../../../const'
import { split, parseContributions } from './contribution'

describe('retirement/calculator/lib/reachers/contribution/utils/contribution', () => {
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

  describe('parseContributions', () => {
    // processor generator
    const p = (interval: string) => ({
      ...parseInterval(interval),
      processor: identity,
    })

    it('should not split when missing processors', () => {
      expect(parseContributions([], [])).toEqual([])
      expect(parseContributions([c('70^90')], [])).toEqual([c('70^90')])
    })

    it('should split based on single processor', () => {
      expect(parseContributions([c('70^90')], [p('1980^2000')])).toEqual([
        c('70^80'),
        c('80^90'),
      ])
    })

    it('should split based on multiple processors', () => {
      expect(
        parseContributions([c('70^90')], [p('1960^1980'), p('1980^2000')])
      ).toEqual([c('70^80'), c('80^90')])
    })

    it('should split based on overlaping processors', () => {
      expect(
        parseContributions([c('70^90')], [p('1960^1985'), p('1975^2000')])
      ).toEqual([c('70^75'), c('75^85'), c('85^90')])
    })
  })
})
