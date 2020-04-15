/* cspell: disable */
import { d, b } from '../test-utils'
import { age, contribution } from '.'

describe('retirement/calculator/lib/reachers', () => {
  describe('contribution', () => {
    it('should exposed contribution based reachers', () => {
      expect(contribution).toHaveProperty('last')
      expect(contribution).toHaveProperty('total')
    })
  })

  describe('age', () => {
    it.each([
      [50, '1940', '1990'],
      [50, '1950', '2000'],
      [50, '1960', '2010'],
      [30, '1960', '1990'],
      [30, '1970', '2000'],
      [30, '1980', '2010'],
    ])('should correctly calculate reach', (years, birth, expected) => {
      const [reached] = age({ years })(b(birth))
      expect(reached).toEqual(d(expected))
    })
  })
})
