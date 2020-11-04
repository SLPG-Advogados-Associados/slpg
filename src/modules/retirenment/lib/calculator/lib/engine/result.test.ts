import { d, u, r } from '../test-utils'

import {
  union,
  intersection,
  before,
  after,
  overlaps,
  any,
  all,
} from './result'

describe('retirement/calculator/engine/result', () => {
  describe('before', () => {
    it.each([
      [d('80'), d('90'), true],
      [d('90'), d('80'), false],
      [u, d('90'), true],
      [d('80'), u, false],
      [u, u, true],
    ])('%j is before %j: %j', (a, b, result) => {
      expect(before(a, b)).toBe(result)
    })
  })

  describe('after', () => {
    it.each([
      [d('80'), d('90'), false],
      [d('90'), d('80'), true],
      [u, d('90'), true],
      [d('80'), u, false],
      [u, u, true],
    ])('%j is after %j: %j', (a, b, result) => {
      expect(after(a, b)).toBe(result)
    })
  })

  describe('overlaps', () => {
    it.each([
      // with infinites/always
      ['^', '^', true],
      ['50^', '^', true],
      ['^', '50^', true],
      ['^50', '^', true],
      ['^', '^50', true],

      // with same direction loose ends
      ['30^', '50^', true],
      ['^30', '^50', true],

      // with overlaping loose end
      ['50^', '40^60', true],
      ['50^', '60^70', true],
      ['40^60', '^50', true],
      ['30^40', '^50', true],

      // with converging loose ends
      ['30^', '^50', true],

      // with diverging loose ends
      ['^30', '50^', false],
      ['30^40', '50^', false],
      ['^50', '60^70', false],

      // with overlap on limit
      ['^50', '50^', true],
      ['30^50', '50^60', true],

      // with simple periods
      ['30^60', '40^50', true], // inner
      ['30^60', '50^70', true], // intersected
      ['30^60', '20^40', true], // intersected
      ['30^40', '50^60', false], // outer

      // custom
      ['^', '95^2005', true],
      ['95^2005', '^', true],
      ['1998-12-16^2003-12-31', '1994-12-23^', true],
    ])('%j overlaps with %j: %j', (a, b, result) => {
      expect(overlaps(r(a), r(b))).toBe(result)
    })
  })

  describe('union', () => {
    // prettier-ignore
    it.each([
      // single
      [['^'], ['^']],
      [['80^'], ['80^']],
      [['^90'], ['^90']],
      [['80^90'], ['80^90']],

      // two, with loose ends
      [['^', '^'], ['^']],
      [['80^', '^'], ['^']],
      [['^', '80^'], ['^']],
      [['^80', '^'], ['^']],
      [['^', '^80'], ['^']],

      // three, with loose ends
      [['^', '^', '^'], ['^']],
      [['80^', '^', '^'], ['^']],
      [['^', '80^', '^'], ['^']],
      [['^80', '^', '^'], ['^']],
      [['^', '^80', '^'], ['^']],

      // with overlap
      [['60^80', '70^90'], ['60^90']],
      [['60^80', '70^90', '80^2000'], ['60^2000']],
      
      // with overlap on limit
      [['60^80', '80^90'], ['60^90']],

      // without overlap
      [['60^70', '80^90'], ['60^70', '80^90']],
      [['60^70', '80^90', '40^50'], ['40^50', '60^70', '80^90']], // sorted

      // with partial overlap
      [['50^70', '80^90', '40^60'], ['40^70', '80^90']],
    ])('%j should result in %j', (input, output) => {
      expect(union(input.map(r))).toEqual(output.map(r))
    })
  })

  describe('intersection', () => {
    // prettier-ignore
    it.each([
      // single
      [['^'], ['^']],
      [['80^'], ['80^']],
      [['^90'], ['^90']],
      [['80^90'], ['80^90']],

      // two, with loose ends
      [['^', '^'], ['^']],
      [['80^', '^'], ['80^']],
      [['^', '80^'], ['80^']],
      [['^80', '^'], ['^80']],
      [['^', '^80'], ['^80']],

      // three, with loose ends
      [['^', '^', '^'], ['^']],
      [['80^', '^', '^'], ['80^']],
      [['^', '80^', '^'], ['80^']],
      [['^80', '^', '^'], ['^80']],
      [['^', '^80', '^'], ['^80']],

      // with overlap
      [['60^80', '70^90'], ['70^80']],
      [['60^80', '70^90', '80^2000'], ['80^80']],

      // with overlap on limit
      [['60^80', '80^90'], ['80^80']],

      // without overlap
      [['60^70', '80^90'], []],
      [['60^70', '80^90', '40^50'], []], // sorted

      // with partial overlap
      [['50^70', '80^90', '40^60'], []],

      // custom
      [['40^50', '30^60'], ['40^50']],
      [['^', '95^2005'], ['95^2005']]
    ])('%j should result in %j', (input, output) => {
      expect(intersection(input.map(r))).toEqual(output.map(r))
    })
  })

  describe('any', () => {
    // prettier-ignore
    it.each([
      // single
      [[['^']], ['^']],
      [[['80^']], ['80^']],
      [[['^90']], ['^90']],
      [[['80^90']], ['80^90']],

      // two, with loose ends
      [[['^'], ['^']], ['^']],
      [[['80^'], ['^']], ['^']],
      [[['^'], ['80^']], ['^']],
      [[['^80'], ['^']], ['^']],
      [[['^'], ['^80']], ['^']],

      [[['^', '^']], ['^']],
      [[['80^', '^']], ['^']],
      [[['^', '80^']], ['^']],
      [[['^80', '^']], ['^']],
      [[['^', '^80']], ['^']],

      // three, with loose ends
      [[['^', '^', '^']], ['^']],
      [[['80^', '^', '^']], ['^']],
      [[['^', '80^', '^']], ['^']],
      [[['^80', '^', '^']], ['^']],
      [[['^', '^80', '^']], ['^']],

      [[['^', '^'], ['^']], ['^']],
      [[['80^', '^'], ['^']], ['^']],
      [[['^', '80^'], ['^']], ['^']],
      [[['^80', '^'], ['^']], ['^']],
      [[['^', '^80'], ['^']], ['^']],

      // with overlap
      [[['60^80', '70^90']], ['60^90']],
      [[['60^80', '70^90', '80^2000']], ['60^2000']],

      [[['60^80'], ['70^90']], ['60^90']],
      [[['60^80'], ['70^90', '80^2000']], ['60^2000']],

      // with overlap on limit
      [[['60^80', '80^90']], ['60^90']],
      [[['60^80'], ['80^90']], ['60^90']],

      // without overlap
      [[['60^70', '80^90']], ['60^70', '80^90']],
      [[['60^70', '80^90', '40^50']], ['40^50', '60^70', '80^90']], // sorted

      [[['60^70'], ['80^90']], ['60^70', '80^90']],
      [[['60^70'], ['80^90', '40^50']], ['40^50', '60^70', '80^90']], // sorted

      // with partial overlap
      [[['50^70', '80^90', '40^60']], ['40^70', '80^90']],
      [[['50^70'], ['80^90', '40^60']], ['40^70', '80^90']],
    ])('%j should result in %j', (input, output) => {
      expect(any(input.map((i) => i.map(r)))).toEqual(output.map(r))
    })
  })

  describe('all', () => {
    // prettier-ignore
    it.each([
      // single
      [[['^']], ['^']],
      [[['80^']], ['80^']],
      [[['^90']], ['^90']],
      [[['80^90']], ['80^90']],

      // two, with loose ends
      [[['^'], ['^']], ['^']],
      [[['80^'], ['^']], ['80^']],
      [[['^'], ['80^']], ['80^']],
      [[['^80'], ['^']], ['^80']],
      [[['^'], ['^80']], ['^80']],

      [[['^', '^']], ['^']],
      [[['80^', '^']], ['^']],
      [[['^', '80^']], ['^']],
      [[['^80', '^']], ['^']],
      [[['^', '^80']], ['^']],

      // three, with loose ends
      [[['^', '^', '^']], ['^']],
      [[['80^', '^', '^']], ['^']],
      [[['^', '80^', '^']], ['^']],
      [[['^80', '^', '^']], ['^']],
      [[['^', '^80', '^']], ['^']],

      [[['^', '^'], ['^']], ['^']],
      [[['80^'], ['^'], ['^']], ['80^']],
      [[['^'], ['80^'], ['^']], ['80^']],
      [[['^80'], ['^'], ['^']], ['^80']],
      [[['^'], ['^80'], ['^']], ['^80']],

      // with overlap
      [[['60^80', '70^90']], ['60^90']],
      [[['60^80', '70^90', '80^2000']], ['60^2000']],

      [[['60^80'], ['70^90']], ['70^80']],
      [[['60^80'], ['70^90', '80^2000']], ['70^80']],

      // with overlap on limit
      [[['60^80', '80^90']], ['60^90']],
      [[['60^80'], ['80^90']], ['80^80']],

      // without overlap
      [[['60^70', '80^90']], ['60^70', '80^90']],
      [[['60^70', '80^90', '40^50']], ['40^50', '60^70', '80^90']], // sorted

      [[['60^70'], ['80^90']], []],
      [[['60^70'], ['80^90', '40^50']], []],

      // with partial overlap
      [[['50^70', '80^90', '40^60']], ['40^70', '80^90']],
      [[['50^70'], ['80^90', '40^60']], ['50^60']],

      // custom
      [[['20^50', '70^90'], ['40^80'], ['30^60']], ['40^50']],
      [[['^'], ['95^2005']], ['95^2005']],
    ])('%j should result in %j', (input, output) => {
      expect(all(input.map((i) => i.map(r)))).toEqual(output.map(r))
    })
  })
})
