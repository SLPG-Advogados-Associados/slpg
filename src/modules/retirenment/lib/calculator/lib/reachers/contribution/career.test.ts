/* cspell: disable */
import { Contribution } from '../../../types'
import { d, c, u } from '../../test-utils'
import { career } from './career'

const o = expect.objectContaining

describe('retirement/calculator/lib/requisites/contribution/career', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

  const same: [undefined, undefined, number] = [u, u, 1]

  // prettier-ignore
  it.each([
    // duration, due, contributions | satisfied, satisfied at, satisfiable, duration by due
    [10, d('2000'), i(c('80')), true, d('1989-12-29'), true, 20],
    [20, d('2000'), i(c('80')), true, d('1999-12-27'), true, 20],
    [20, d('2000'), i(c('50^75'), c('80')), true, d('1999-12-27'), true, 20],
    [10, d('2000'), i(c('70^90')), true, d('1979-12-30'), true, 20],
    [10, d('2000'), i(c('50^75'), c('70^90')), true, d('1979-12-30'), true, 20],
    [20, d('2000'), i(c('50^75'), c('70^90')), true, d('1989-12-27'), true, 20],
    [20, d('2000'), i(c('81')), false, u, false, 19],
    [20, d('2000'), i(c('50^75'), c('81')), false, u, false, 19],
    [20, d('2000'), i(c('80^90')), false, u, false, 10],
    [20, d('2000'), i(c('50^75'), c('80^90')), false, u, false, 10],
    // will satisfy in time
    [10, d('2030'), i(c('2020')), false, u, true, 10],

    // career combination
    [10, d('2000'), i(c('90^95', same), c('95^2000', same)), true, d('1999-12-30'), true, 10],
  ])(
    'should correctly calculate results',
    (years, due, input, satisfied, satisfiedAt, satisfiable, yearsByDue) => {
      expect(career({ expected: { years }, due })(input)).toMatchObject({
        satisfied,
        satisfiedAt,
        satisfiable,
        context: { durationByDue: o({ years: yearsByDue }) },
      })
    }
  )
})
