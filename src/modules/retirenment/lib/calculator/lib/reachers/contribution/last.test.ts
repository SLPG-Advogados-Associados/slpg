/* cspell: disable */
import { Contribution, ServiceKind } from '../../../types'
import { c, u, result } from '../../test-utils'
import { last } from './last'

const { PRIVATE, PUBLIC } = ServiceKind

describe('retirement/calculator/lib/requisites/contribution/last', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

  const isPublic = ({ service: { kind } }: Contribution) => kind === PUBLIC

  it.each([
    // single constraint contribution
    [10, u, i(c('80^90')), ['89-12-29^90']],
    [10, u, i(c('80^95')), ['89-12-29^95']],
    [10, u, i(c('80^85')), []],

    // single no-end contribution
    [10, u, i(c('80^')), ['89-12-29^']],

    // multiple contribution
    [10, u, i(c('80^90'), c('95^2005')), ['89-12-29^90', '2004-12-29^2005']],
    [10, u, i(c('80^95'), c('95^2010')), ['89-12-29^95', '2004-12-29^2010']],
    [10, u, i(c('80^85'), c('95^2010')), ['2004-12-29^2010']],
    [10, u, i(c('80^85'), c('95^2000')), []],

    // filtered
    [10, () => false, i(c('80^90')), []],
    [10, isPublic, i(c('50^80', [PRIVATE]), c('80^90')), ['89-12-29^90']],
  ])('should correctly calculate results', (years, filter, input, output) => {
    expect(last({ expected: { years }, filter })(input)).toEqual(
      output.map(result)
    )
  })
})
