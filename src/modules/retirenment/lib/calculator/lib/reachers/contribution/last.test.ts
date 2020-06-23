/* cspell: disable */
import { Contribution } from '../../../types'
import { d, c } from '../../test-utils'
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
    [20, d('2000'), i(c('81')), false, d('2000-12-27'), false, 19],
    [20, d('2000'), i(c('50^75'), c('81')), false, d('2000-12-27'), false, 19],
    [20, d('2000'), i(c('80^90')), false, d('1999-12-27'), false, 10],
    [20, d('2000'), i(c('50^75'), c('80^90')), false, d('1999-12-27'), false, 10],
    // will satisfy in time
    [10, d('2030'), i(c('2020')), false, d('2029-12-29'), true, 10],
  ])(
    'should correctly calculate results',
    (years, due, input, satisfied, satisfiedAt, satisfiable, yearsByDue) => {
      expect(last({ expected: { years }, due })(input)).toEqual({
        satisfied,
        satisfiedAt,
        satisfiable,
        context: { durationByDue: o({ years: yearsByDue }) },
      })
    }
  )
})
