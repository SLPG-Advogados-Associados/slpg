/* cspell: disable */
import { isValid } from 'date-fns'
// @ts-ignore
import {
  age,
  lastContributionDuration,
  totalContributionDuration,
  merge,
} from './conditions'

import { Condition } from '../types'

// @ts-ignore
// Shorter Date factory.
const d = (...args) => new Date(...args)

/**
 * Predicate factory for context.reached date year comparison.
 * @param year Year in number format.
 */
const reachedAt = year => ([, { reached }]) => reached.getFullYear() === year

describe('retirement/calculator/lib/conditions', () => {
  describe('age', () => {
    const cond = age

    it('should correctly qualify', () => {
      expect(cond(d('2000'), 50, { birthDate: d('1940') })[0]).toBe(true)
      expect(cond(d('2000'), 50, { birthDate: d('1950') })[0]).toBe(true)
      expect(cond(d('2000'), 50, { birthDate: d('1960') })[0]).toBe(false)
      expect(cond(d('2000'), 30, { birthDate: d('1960') })[0]).toBe(true)
      expect(cond(d('2000'), 30, { birthDate: d('1970') })[0]).toBe(true)
      expect(cond(d('2000'), 30, { birthDate: d('1980') })[0]).toBe(false)
    })

    it('should return "reached" context', () => {
      const result = cond(d('2000'), 50, { birthDate: d('1940') })
      expect(result).toSatisfy(reachedAt(1990))
    })
  })

  describe('lastContributionDuration', () => {
    const cond = lastContributionDuration

    const c = (...spans) => ({
      contributions: spans.map(([start, end]) => ({
        start: d(start),
        end: end ? d(end) : undefined,
      })),
    })

    it('should correctly qualify', () => {
      // 20, from start to due
      expect(cond(d('2000'), 10, c(['1980']))[0]).toBe(true)
      expect(cond(d('2000'), 20, c(['1980']))[0]).toBe(true)
      expect(cond(d('2000'), 20, c([], ['1980']))[0]).toBe(true)

      // 20, from start to end
      expect(cond(d('2000'), 10, c(['1970', '1990']))[0]).toBe(true)
      expect(cond(d('2000'), 10, c([], ['1970', '1990']))[0]).toBe(true)

      // 20 precisely, from start to en
      expect(cond(d('2000'), 20, c([], ['1970', '1990']))[0]).toBe(true)

      // only 19, from start to due
      expect(cond(d('2000'), 20, c(['1981']))[0]).toBe(false)
      expect(cond(d('2000'), 20, c([], ['1981']))[0]).toBe(false)

      // only 10, from start to end
      expect(cond(d('2000'), 20, c(['1980', '1990']))[0]).toBe(false)
      expect(cond(d('2000'), 20, c([], ['1980', '1990']))[0]).toBe(false)
    })

    it('should return "reached" context', () => {
      expect(cond(d('2000'), 10, c(['1980']))).toSatisfy(reachedAt(1990))
      expect(cond(d('2000'), 30, c(['1980']))).toSatisfy(reachedAt(2010))
    })
  })

  describe('totalContributionDuration', () => {
    const cond = totalContributionDuration

    const c = (...spans) => ({
      contributions: spans.map(([start, end]) => ({
        start: d(start),
        end: end ? d(end) : undefined,
      })),
    })

    // expects 20 years, until 2000
    const check = input => cond(d('2000'), 20, input)

    it('should correctly qualify', () => {
      // success

      // 20 years, single, before due
      expect(check(c(['1970', '1990']))[0]).toBe(true)
      // 20 years, double, before due
      expect(check(c(['1960', '1965'], ['1970', '1985']))[0]).toBe(true)
      // 20+ years, single, before due
      expect(check(c(['1970']))[0]).toBe(true)

      // fail

      // only 10 years, single, before due
      expect(check(c(['1980', '1990']))[0]).toBe(false)
      // only 10 years, double, before due
      expect(check(c(['1960', '1965'], ['1970', '1975']))[0]).toBe(false)
      // 20+ years, single, but after due
      expect(check(c(['1990']))[0]).toBe(false)
      // 20+ years, double, but after due
      expect(check(c(['1990', '1995'], ['2000']))[0]).toBe(false)

      // no due, will always evaluate satisfied wheneve reached
      expect(cond(null, 20, c(['1990']))[0]).toBe(true)
      expect(cond(null, 20, c(['2010']))[0]).toBe(false) // not yet
    })

    it('should return context', () => {
      expect(check(c(['1980']))).toSatisfy(reachedAt(2000))
      expect(check(c(['1980']))).toHaveProperty('1.duration.years', 40)

      expect(check(c(['1990']))).toSatisfy(reachedAt(2010))
      expect(check(c(['1990']))).toHaveProperty('1.duration.years', 30)

      expect(check(c(['1970', '1995']))).toSatisfy(reachedAt(1990))
      expect(check(c(['1970', '1995']))).toHaveProperty('1.duration.years', 25)
    })
  })

  describe('merge', () => {
    type Conds = { [key: string]: { [key: string]: Condition } }
    const { all } = merge

    const conds: Conds = {
      pass: {
        on1990: () => [true, { reached: new Date('1990') }],
        on2000: () => [true, { reached: new Date('2000') }],
      },
      fail: {
        on1995: () => [false, { reached: new Date('1995') }],
        on2005: () => [false, { reached: new Date('2005') }],
      },
    }

    describe('all', () => {
      it('should merge multiple conditions', () => {
        expect(all([])).toBeFunction()
        expect(all([conds.pass.on1990])).toBeFunction()
        expect(all([conds.pass.on1990, conds.pass.on2000])).toBeFunction()
      })

      it('should handle empty merges', () => {
        const [satisfied, { reached }] = all([], {})
        expect(satisfied).toBe(true)
        expect(reached).toBeInstanceOf(Date)
        expect(reached).not.toSatisfy(isValid)
      })
    })
  })
})
