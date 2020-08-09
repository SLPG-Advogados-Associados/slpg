import { d } from '../test-utils'
import { after } from './after'
import { RequisiteResult } from '../engine'

describe('retirement/calculator/lib/requisites/after', () => {
  it('should correctly calculate results', () => {
    let res: RequisiteResult

    res = after(d('1990'))({})
    expect(res).toMatchObject({
      satisfied: true,
      satisfiedAt: d('1990'),
      satisfiable: true,
      satisfiableAt: d('1990'),
    })

    res = after(d('3000'))({})
    expect(res).toMatchObject({
      satisfied: false,
      satisfiedAt: undefined,
      satisfiable: true,
      satisfiableAt: d('3000'),
    })
  })
})
