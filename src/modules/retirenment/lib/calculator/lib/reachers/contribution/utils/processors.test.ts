import { identity } from 'ramda'

import { d, c } from '../../../test-utils'
import { EMPTY_DURATION, compare } from '../../../duration'
import {
  ProcessorContext,
  parseProcessors,
  filter,
  multiply,
  mergeProcessors,
} from './processors'

describe('retirement/calculator/lib/reachers/contribution/processors', () => {
  const duration = { years: 1 }
  const context = { contribution: c('1990^2000') } as ProcessorContext

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
    it('should return original duration for truthy predicate', () => {
      const processor = filter(() => true)
      expect(processor(duration, context)).toBe(duration)
    })

    it('should return empty duration for falsy predicate', () => {
      const processor = filter(() => false)
      expect(processor(duration, context)).toBe(EMPTY_DURATION)
    })
  })

  describe('multiply', () => {
    it('should multiply resulting durations', () => {
      const result = multiply(2)(duration, context)
      expect(compare.equals(result, { years: 2 })).toBe(true)
    })
  })

  describe('mergeProcessors', () => {
    it('should be possible to merge empty processor list', () => {
      const merged = mergeProcessors([])
      expect(merged(duration, context)).toBe(duration)
    })

    it('should be possible to merge single processor', () => {
      const fn = jest.fn(identity)

      const merged = mergeProcessors([
        { start: null, end: null, processor: fn },
      ])

      expect(merged(duration, context)).toBe(duration)
      expect(fn).toHaveBeenCalled()
    })

    it('should apply multiple processors', () => {
      const id = jest.fn(identity)
      const multi = jest.fn(multiply(2))

      const merged = mergeProcessors([
        { start: null, end: null, processor: multi },
        { start: null, end: null, processor: id },
      ])

      expect(merged(duration, context)).toMatchObject({ days: 730 })

      expect(id).toHaveBeenCalled()
      expect(multi).toHaveBeenCalled()
    })

    it('should selectively apply processors based on contribution start/end', () => {
      const id = jest.fn(identity)
      const multi = jest.fn(multiply(2))

      const merged = mergeProcessors([
        { start: null, end: d('1980'), processor: multi },
        { start: null, end: null, processor: id },
      ])

      expect(merged(duration, context)).toBe(duration)

      expect(id).toHaveBeenCalled()
      expect(multi).not.toHaveBeenCalled()
    })
  })
})
