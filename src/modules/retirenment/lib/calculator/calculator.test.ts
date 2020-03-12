import { Calculator } from './'

describe('retirement/calculator', () => {
  it('should be possible to instantiate new calculator', () => {
    const calculator = new Calculator()
    expect(calculator).toBeInstanceOf(Calculator)
  })
})
