/* cspell: disable */
import { Contribution, ServiceKind } from '../../../types'
import { d, c, u } from '../../test-utils'
import { last } from './last'

const { PRIVATE, PUBLIC } = ServiceKind

describe('retirement/calculator/lib/requisites/contribution/last', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

  const r = (from: string, to?: string) => ({
    from: d(from),
    to: to ? d(to) : u,
  })

  const isPublic = ({ service: { kind } }: Contribution) => kind === PUBLIC

  it.each([
    // single constraint contribution
    [10, u, i(c('80^90')), [r('90', '90')]],
    [10, u, i(c('80^95')), [r('90', '95')]],
    [10, u, i(c('80^85')), []],

    // single no-end contribution
    [10, u, i(c('80^')), [r('90', u)]],

    // multiple contribution
    [10, u, i(c('80^90'), c('95^2005')), [r('90', '90'), r('2005', '2005')]],
    [10, u, i(c('80^95'), c('95^2010')), [r('90', '95'), r('2005', '2010')]],
    [10, u, i(c('80^85'), c('95^2010')), [r('2005', '2010')]],
    [10, u, i(c('80^85'), c('95^2000')), []],

    // filtered
    [10, () => false, i(c('80^90')), []],
    [10, isPublic, i(c('50^80', [PRIVATE]), c('80^90')), [r('90', '90')]],
  ])('should correctly calculate results', (years, filter, input, result) => {
    expect(last({ expected: { years }, filter })(input)).toEqual(result)
  })
})
