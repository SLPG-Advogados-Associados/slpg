import { classed } from './classed-str'

describe('design/lib/classed', () => {
  it('should parse to an "attr" callback', () => {
    expect(classed``).toBeInstanceOf(Function)
  })

  it('should return className prop when executed', () => {
    expect(classed``({})).toHaveProperty('className', '')
  })

  it('should return any passed in class names', () => {
    expect(classed`foo`({})).toHaveProperty('className', 'foo')
  })

  it('should return additional class names received by props', () => {
    expect(classed``({ className: 'foo' })).toHaveProperty('className', 'foo')
  })

  it('should merge passed in and received class names', () => {
    expect(classed`foo`({ className: 'bar' })).toHaveProperty(
      'className',
      'foo bar'
    )
  })

  it('should resolve interpolated strings', () => {
    expect(classed`${'foo'}`({})).toHaveProperty('className', 'foo')
  })

  it('should resolve passed in class names with interpolated strings', () => {
    expect(classed`foo ${'bar'}`({})).toHaveProperty('className', 'foo bar')
  })

  it('should interpolate where is', () => {
    expect(classed`foo ${'bar'}-tor`({})).toHaveProperty(
      'className',
      'foo bar-tor'
    )
  })

  it('should resolve passed in class names, interpolations, and received class names', () => {
    expect(classed`foo ${'bar'}`({ className: 'tor' })).toHaveProperty(
      'className',
      'foo bar tor'
    )
  })

  it('should execute function interpolations', () => {
    const props = {}
    const fn = jest.fn(() => 'bar')
    expect(classed`foo ${fn}`(props)).toHaveProperty('className', 'foo bar')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(props)
  })

  it('should accept an array of classes', () => {
    expect(classed(['foo', 'bar'])({})).toHaveProperty('className', 'foo bar')
  })
})
