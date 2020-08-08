import { identity } from 'ramda'

import { d, c } from '../../../test-utils'
import { ProcessorContext, parseProcessors, filter } from './processors'
import { EMPTY_DURATION } from '../../../duration'

describe('retirement/calculator/lib/reachers/contribution/processors', () => {
  describe('parseProcessors', () => {
    it('should parse empty set of processors', () => {
      expect(parseProcessors({})).toEqual([])
    })

    it('should parse single all-time processor', () => {
      expect(parseProcessors({ '^': identity })).toEqual([
        { start: null, end: null, processor: identity },
      ])
    })

    it('should parse single start/end processor', () => {
      expect(parseProcessors({ '1990^2000': identity })).toEqual([
        { start: d('1990'), end: d('2000'), processor: identity },
      ])
    })

    it('should parse multiple processors', () => {
      expect(parseProcessors({ '^': identity, '1990^2000': identity })).toEqual(
        [
          { start: null, end: null, processor: identity },
          { start: d('1990'), end: d('2000'), processor: identity },
        ]
      )
    })
  })

  describe('filter', () => {
    const duration = { years: 1 }
    const context = { contribution: c('1990^2000') } as ProcessorContext

    it('should return original duration for truthy predicate', () => {
      const processor = filter(() => true)
      expect(processor(duration, context)).toBe(duration)
    })

    it('should return empty duration for falsy predicate', () => {
      const processor = filter(() => false)
      expect(processor(duration, context)).toBe(EMPTY_DURATION)
    })
  })
})
