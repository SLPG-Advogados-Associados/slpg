import { Contribution, ServiceKind } from '../../../types'
import { contribution, u, result } from '../../test-utils'
import { career } from './career'

const { PRIVATE: PR, PUBLIC } = ServiceKind

describe('retirement/calculator/lib/requisites/contribution/career', () => {
  const i = (...contributions: Contribution[]) => ({ contributions })

  const c = (span: string, career: number, kind?: ServiceKind) =>
    contribution(span, [kind, u, career])

  const isPublic = ({ service: { kind } }: Contribution) => kind === PUBLIC

  it.each([
    // single constraint contribution
    [10, u, i(c('80^90', 1)), ['89-12-29^90']],
    [10, u, i(c('80^95', 1)), ['89-12-29^95']],
    [10, u, i(c('80^85', 1)), []],

    // single no-end contribution
    [10, u, i(c('80^', 1)), ['89-12-29^']],

    // multiple contribution, same career
    [10, u, i(c('75^80', 1), c('80^90', 1)), ['84-12-29^90']],
    [10, u, i(c('70^80', 1), c('85^95', 1)), ['79-12-30^80', '94-12-30^95']],
    [10, u, i(c('80^85', 1), c('90^95', 1)), []],

    // multiple contribution, different career
    [10, u, i(c('75^80', 1), c('80^90', 2)), ['89-12-29^90']],
    [10, u, i(c('70^80', 1), c('85^95', 2)), ['79-12-30^80', '94-12-30^95']],
    [10, u, i(c('80^85', 1), c('90^95', 2)), []],

    // filtered
    [10, () => false, i(c('80^90', 1), c('90^95', 1)), []],
    [10, isPublic, i(c('50^80', 1, PR), c('80^90', 1)), ['89-12-29^90']],
  ])('should correctly calculate results', (years, filter, input, output) => {
    expect(career({ expected: { years }, filter })(input)).toEqual(
      output.map(result)
    )
  })
})
