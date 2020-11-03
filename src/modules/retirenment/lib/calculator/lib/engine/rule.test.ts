import { Rule } from './rule'

describe('retirement/calculator/engine/rule', () => {
  it('should instantiate a rule', () => {
    const instance = new Rule({
      title: 'Title',
      description: 'Description',
      promulgation: new Date('2000'),
      possibilities: [],
    })

    expect(instance).toBeInstanceOf(Rule)
  })
})
