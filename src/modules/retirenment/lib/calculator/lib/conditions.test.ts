/* cspell: disable */
// @ts-ignore
import { __get__ } from './conditions'

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
    const cond = __get__('age')

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
    const cond = __get__('lastContributionDuration')

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

  describe('contributionDuration', () => {
    const cond = __get__('contributionDuration')

    const c = (...spans) => ({
      contributions: spans.map(([start, end]) => ({
        start: d(start),
        end: end ? d(end) : undefined,
      })),
    })

    it('should correctly qualify', () => {
      // 10, from start to due
      expect(cond(d('2000'), 10, c(['1980', '1990']))[0]).toBe(true)
      // expect(cond(d('2000'), 20, c(['1980']))[0]).toBe(true)
      // expect(cond(d('2000'), 20, c([], ['1980']))[0]).toBe(true)

      // // 20, from start to end
      // expect(cond(d('2000'), 10, c(['1970', '1990']))[0]).toBe(true)
      // expect(cond(d('2000'), 10, c([], ['1970', '1990']))[0]).toBe(true)

      // // 20 precisely, from start to en
      // expect(cond(d('2000'), 20, c([], ['1970', '1990']))[0]).toBe(true)

      // // only 19, from start to due
      // expect(cond(d('2000'), 20, c(['1981']))[0]).toBe(false)
      // expect(cond(d('2000'), 20, c([], ['1981']))[0]).toBe(false)

      // // only 10, from start to end
      // expect(cond(d('2000'), 20, c(['1980', '1990']))[0]).toBe(false)
      // expect(cond(d('2000'), 20, c([], ['1980', '1990']))[0]).toBe(false)
    })

    // it('should return "reached" context', () => {
    //   expect(cond(d('2000'), 10, c(['1980']))).toSatisfy(reachedAt(1990))
    //   expect(cond(d('2000'), 30, c(['1980']))).toSatisfy(reachedAt(2010))
    // })
  })
})