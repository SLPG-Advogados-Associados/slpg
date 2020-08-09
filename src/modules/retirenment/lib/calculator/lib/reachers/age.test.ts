import { d, u } from '../test-utils'
import { age } from './age'

const o = expect.objectContaining

describe('retirement/calculator/lib/requisites/age', () => {
  it.each([
    // age, due, birth | satisfied, satisfied at, age by due
    [50, '2000', d('1940'), true, d('1990'), 60],
    [50, '2000', d('1950'), true, d('2000'), 50],
    [50, '2000', d('1960'), false, u, 40],
    [30, '2000', d('1960'), true, d('1990'), 40],
    [30, '2000', d('1970'), true, d('2000'), 30],
    [30, '2000', d('1980'), false, u, 20],
  ])(
    'should correctly calculate results',
    (years, due, birthDate, satisfied, satisfiedAt, ageByDue) => {
      const reacher = age({ expected: { years }, due: d(due) })

      expect(reacher({ birthDate })).toEqual({
        satisfied,
        satisfiedAt,
        satisfiable: false,
        context: { ageByDue: o({ years: ageByDue }) },
      })
    }
  )
})
