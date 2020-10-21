import { d } from '../test-utils'
import { age } from './age'

describe('retirement/calculator/lib/requisites/age', () => {
  it.each([
    [50, d('1940'), d('1990')],
    [20, d('1940'), d('1960')],
    [70, d('1940'), d('2010')],
  ])('should correctly calculate results', (years, birthDate, expected) => {
    const [{ from }] = age({ expected: { years } })({ birthDate })
    expect(from).toEqual(expected)
  })
})
