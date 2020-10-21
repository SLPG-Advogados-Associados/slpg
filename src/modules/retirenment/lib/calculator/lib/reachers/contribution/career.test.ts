import { Contribution, ServiceKind } from '../../../types'
import { d, contribution, u } from '../../test-utils'
import { career } from './career'

const { PRIVATE: PR, PUBLIC } = ServiceKind

describe('retirement/calculator/lib/requisites/contribution/career', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

  const c = (span: string, career: number, kind?: ServiceKind) =>
    contribution(span, [kind, u, career])

  const r = (from: string, to?: string) => ({
    from: d(from),
    to: to ? d(to) : u,
  })

  const isPublic = ({ service: { kind } }: Contribution) => kind === PUBLIC

  it.each([
    // single constraint contribution
    [10, u, i(c('80^90', 1)), [r('90', '90')]],
    [10, u, i(c('80^95', 1)), [r('90', '95')]],
    [10, u, i(c('80^85', 1)), []],

    // single no-end contribution
    [10, u, i(c('80^', 1)), [r('90', u)]],

    // multiple contribution, same career
    [10, u, i(c('75^80', 1), c('80^90', 1)), [r('85', '90')]],
    [10, u, i(c('70^80', 1), c('85^95', 1)), [r('80', '80'), r('95', '95')]],
    [10, u, i(c('80^85', 1), c('90^95', 1)), []],

    // multiple contribution, different career
    [10, u, i(c('75^80', 1), c('80^90', 2)), [r('90', '90')]],
    [10, u, i(c('70^80', 1), c('85^95', 2)), [r('80', '80'), r('95', '95')]],
    [10, u, i(c('80^85', 1), c('90^95', 2)), []],

    // filtered
    [10, () => false, i(c('80^90', 1), c('90^95', 1)), []],
    [10, isPublic, i(c('50^80', 1, PR), c('80^90', 1)), [r('90', '90')]],
  ])('should correctly calculate results', (years, filter, input, result) => {
    expect(career({ expected: { years }, filter })(input)).toEqual(result)
  })
})
