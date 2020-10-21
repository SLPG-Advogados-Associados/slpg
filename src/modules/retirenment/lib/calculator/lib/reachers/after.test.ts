import { d } from '../test-utils'
import { after } from './after'

describe('retirement/calculator/lib/requisites/after', () => {
  it('should correctly calculate results', () => {
    expect(after(d('1900'))()).toHaveProperty('0.from', d('1900'))
    expect(after(d('1990'))()).toHaveProperty('0.from', d('1990'))
    expect(after(d('2000'))()).toHaveProperty('0.from', d('2000'))
    expect(after(d('2015'))()).toHaveProperty('0.from', d('2015'))
    expect(after(d('2100'))()).toHaveProperty('0.from', d('2100'))
  })
})
