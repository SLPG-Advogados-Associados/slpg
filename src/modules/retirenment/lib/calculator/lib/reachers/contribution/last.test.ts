/* cspell: disable */
import { Contribution } from '../../../types'
import { d, c, u } from '../../test-utils'
import { last } from './last'

const o = expect.objectContaining

describe('retirement/calculator/lib/requisites/contribution/last', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

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
  ])(
    'should correctly calculate results',
    (years, due, input, satisfied, satisfiedAt, satisfiable, yearsByDue) => {
      expect(last({ expected: { years }, due })(input)).toMatchObject({
        satisfied,
        satisfiedAt,
        satisfiable,
        context: { durationByDue: o({ years: yearsByDue }) },
      })
    }
  )
})
