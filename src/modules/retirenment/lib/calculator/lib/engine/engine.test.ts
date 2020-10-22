import { Engine, RequisiteGroup } from '.'
import { d, period } from '../test-utils'

describe('retirement/calculator/engine', () => {
  const res = (span: string) => {
    const [from, to] = period(span)
    return { from, to }
  }

  const r = {
    always: {
      title: 'Always',
      description: 'A requisite which is always true',
      executor: jest.fn(() => [{}]),
    },

    never: {
      title: 'Never',
      executor: jest.fn(() => []),
    },

    withStart: {
      title: 'With start',
      executor: jest.fn(() => [{ from: d('80') }]),
    },

    withEnd: {
      title: 'With end',
      executor: jest.fn(() => [{ to: d('90') }]),
    },
  }

  beforeEach(jest.clearAllMocks)

  it('should instantiate an engine', () => {
    const engine = new Engine(r.always)
    expect(engine).toBeInstanceOf(Engine)
  })

  it('should evaluate single requisites', () => {
    expect(new Engine(r.always).execute({})).toEqual([{}])
    expect(new Engine(r.never).execute({})).toEqual([])
  })

  describe('any', () => {
    it('should evaluate ANY requisites list with single requisite', () => {
      const engine = new Engine({ any: [r.always] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ANY requisites list with multiple requisites', () => {
      const engine = new Engine({ any: [r.always, r.never] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ANY requisites list with single unsatisfied', () => {
      const engine = new Engine({ any: [r.never] })
      expect(engine.execute({})).toEqual([])
    })
  })

  describe('all', () => {
    it('should evaluate ALL requisites list with single requisite', () => {
      const engine = new Engine({ all: [r.always] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ALL requisites list with multiple requisites', () => {
      const engine = new Engine({ all: [r.always, r.never] })
      expect(engine.execute({})).toEqual([])
    })
  })

  describe('nested', () => {
    it('should evaluate nested requisites', () => {
      let req: RequisiteGroup<{}>

      req = { all: [r.always, { any: [r.never] }] }
      expect(new Engine(req).execute({})).toEqual([])

      req = { any: [r.always, { all: [r.never] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = { all: [r.always, { any: [r.never, r.always] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = { all: [r.always, { all: [r.never, r.always] }] }
      expect(new Engine(req).execute({})).toEqual([])

      req = { any: [r.never, { all: [r.always] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = { any: [{ any: [{ any: [{ all: [r.always, r.never] }] }] }] }
      expect(new Engine(req).execute({})).toEqual([])
    })

    it('should evaluate combinations', () => {
      let req: RequisiteGroup<{}>

      // any

      req = { any: [r.withStart, r.never] }
      expect(new Engine(req).execute({})).toEqual([res('80^')])

      req = { any: [r.never, r.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([res('^90')])

      req = { any: [r.withStart, r.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([res('^')])

      // all

      req = { all: [r.withStart, r.always] }
      expect(new Engine(req).execute({})).toEqual([res('80^')])

      req = { all: [r.always, r.withEnd] }
      expect(new Engine(req).execute({})).toEqual([res('^90')])

      req = { all: [r.withStart, r.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([res('80^90')])
    })
  })

  describe('input & params', () => {
    it('should provide any execution input to requisites', () => {
      const input = {}
      new Engine(r.always).execute(input)
      expect(r.always.executor).toHaveBeenCalledWith(input)
    })
  })

  describe('result', () => {
    it('should save flat partial results for root chain', () => {
      const engine = new Engine(r.always)
      engine.execute({})
      expect(engine.partials).toMatchObject([[r.always, [{}], {}]])
    })

    it('should save flat partial results when nested chain', () => {
      const chain = { any: [r.always, r.never] }
      const engine = new Engine(chain)

      engine.execute({})

      expect(engine.partials).toMatchObject([
        [r.always, [{}], {}],
        [r.never, [], {}],
        [chain, [{}], {}],
      ])
    })
  })

  describe('getChain', () => {
    const chain = {
      all: [r.always, { any: [r.never, { all: [r.withStart, r.withEnd] }] }],
    }

    const engine = new Engine(chain)

    it('should fetch first level nested chains', () => {
      expect(engine.getChain('')).toBe(chain)
    })

    it('should fetch nested chains', () => {
      expect(engine.getChain('all.0')).toBe(r.always)
      expect(engine.getChain('all.1.any.1.all.0')).toBe(r.withStart)
    })

    it('should throw for missing chain paths', () => {
      const err = 'Could not find chain'

      expect(() => engine.getChain('all.2')).toThrow(err)
      expect(() => engine.getChain('something.else')).toThrow(err)
    })

    it('should throw for invalid chain paths', () => {
      const err = 'Invalid chain found at'
      expect(() => engine.getChain('all.1.any')).toThrow(err)
    })
  })

  describe('findChain', () => {
    const engine = new Engine({
      all: [
        r.always,
        { title: 'Second', any: [r.never, { all: [r.withStart] }] },
        { any: [{ all: [r.withEnd] }] },
      ],
    })

    it('should not find unexisting reference', () => {
      expect(engine.find('Unexisting')).toBeNull()
    })

    it('should find direct reference', () => {
      expect(engine.find('Always')).toBe(r.always)
    })

    it('should find nested references', () => {
      expect(engine.find('Second', 'Never')).toBe(r.never)
    })

    it('should find nested references with skipping steps', () => {
      expect(engine.find('Second', 'With start')).toBe(r.withStart)
    })

    it('should find based on description also', () => {
      expect(engine.find('A requisite which is always true')).toBe(r.always)
    })

    it('should not find when partially fit', () => {
      expect(engine.find('Second', 'Unexisting')).toBeNull()
    })
  })
})
