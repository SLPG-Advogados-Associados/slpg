import { d } from '../test-utils'
import { before } from './before'

describe('retirement/calculator/lib/requisites/before', () => {
  it('should correctly calculate results', () => {
    expect(before(d('1900'))()).toHaveProperty('0.to', d('1900'))
    expect(before(d('1990'))()).toHaveProperty('0.to', d('1990'))
    expect(before(d('2000'))()).toHaveProperty('0.to', d('2000'))
    expect(before(d('2015'))()).toHaveProperty('0.to', d('2015'))
    expect(before(d('2100'))()).toHaveProperty('0.to', d('2100'))
  })
})
