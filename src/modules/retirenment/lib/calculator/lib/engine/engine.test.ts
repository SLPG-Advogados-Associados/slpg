import { Engine, RequisiteGroup } from '.'
import { d, r } from '../test-utils'

describe('retirement/calculator/engine', () => {
  const rules = {
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
    const engine = new Engine(rules.always)
    expect(engine).toBeInstanceOf(Engine)
  })

  it('should evaluate single requisites', () => {
    expect(new Engine(rules.always).execute({})).toEqual([{}])
    expect(new Engine(rules.never).execute({})).toEqual([])
  })

  describe('any', () => {
    it('should evaluate ANY requisites list with single requisite', () => {
      const engine = new Engine({ any: [rules.always] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ANY requisites list with multiple requisites', () => {
      const engine = new Engine({ any: [rules.always, rules.never] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ANY requisites list with single unsatisfied', () => {
      const engine = new Engine({ any: [rules.never] })
      expect(engine.execute({})).toEqual([])
    })
  })

  describe('all', () => {
    it('should evaluate ALL requisites list with single requisite', () => {
      const engine = new Engine({ all: [rules.always] })
      expect(engine.execute({})).toEqual([{}])
    })

    it('should evaluate ALL requisites list with multiple requisites', () => {
      const engine = new Engine({ all: [rules.always, rules.never] })
      expect(engine.execute({})).toEqual([])
    })
  })

  describe('nested', () => {
    it('should evaluate nested requisites', () => {
      let req: RequisiteGroup<{}>

      req = { all: [rules.always, { any: [rules.never] }] }
      expect(new Engine(req).execute({})).toEqual([])

      req = { any: [rules.always, { all: [rules.never] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = { all: [rules.always, { any: [rules.never, rules.always] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = { all: [rules.always, { all: [rules.never, rules.always] }] }
      expect(new Engine(req).execute({})).toEqual([])

      req = { any: [rules.never, { all: [rules.always] }] }
      expect(new Engine(req).execute({})).toEqual([{}])

      req = {
        any: [{ any: [{ any: [{ all: [rules.always, rules.never] }] }] }],
      }
      expect(new Engine(req).execute({})).toEqual([])
    })

    it('should evaluate combinations', () => {
      let req: RequisiteGroup<{}>

      // any

      req = { any: [rules.withStart, rules.never] }
      expect(new Engine(req).execute({})).toEqual([r('80^')])

      req = { any: [rules.never, rules.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([r('^90')])

      req = { any: [rules.withStart, rules.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([r('^')])

      // all

      req = { all: [rules.withStart, rules.always] }
      expect(new Engine(req).execute({})).toEqual([r('80^')])

      req = { all: [rules.always, rules.withEnd] }
      expect(new Engine(req).execute({})).toEqual([r('^90')])

      req = { all: [rules.withStart, rules.withEnd] }
      // res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toEqual([r('80^90')])
    })
  })

  describe('input & params', () => {
    it('should provide any execution input to requisites', () => {
      const input = {}
      new Engine(rules.always).execute(input)
      expect(rules.always.executor).toHaveBeenCalledWith(input)
    })
  })

  describe('result', () => {
    it('should save flat partial results for root chain', () => {
      const engine = new Engine(rules.always)
      engine.execute({})
      expect(engine.partials).toMatchObject([[rules.always, [{}], {}]])
    })

    it('should save flat partial results when nested chain', () => {
      const chain = { any: [rules.always, rules.never] }
      const engine = new Engine(chain)

      engine.execute({})

      expect(engine.partials).toMatchObject([
        [rules.always, [{}], {}],
        [rules.never, [], {}],
        [chain, [{}], {}],
      ])
    })
  })

  describe('getChain', () => {
    const chain = {
      all: [
        rules.always,
        { any: [rules.never, { all: [rules.withStart, rules.withEnd] }] },
      ],
    }

    const engine = new Engine(chain)

    it('should fetch first level nested chains', () => {
      expect(engine.getChain('')).toBe(chain)
    })

    it('should fetch nested chains', () => {
      expect(engine.getChain('all.0')).toBe(rules.always)
      expect(engine.getChain('all.1.any.1.all.0')).toBe(rules.withStart)
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
        rules.always,
        { title: 'Second', any: [rules.never, { all: [rules.withStart] }] },
        { any: [{ all: [rules.withEnd] }] },
      ],
    })

    it('should not find unexisting reference', () => {
      expect(engine.find('Unexisting')).toBeNull()
    })

    it('should find direct reference', () => {
      expect(engine.find('Always')).toBe(rules.always)
    })

    it('should find nested references', () => {
      expect(engine.find('Second', 'Never')).toBe(rules.never)
    })

    it('should find nested references with skipping steps', () => {
      expect(engine.find('Second', 'With start')).toBe(rules.withStart)
    })

    it('should find based on description also', () => {
      expect(engine.find('A requisite which is always true')).toBe(rules.always)
    })

    it('should not find when partially fit', () => {
      expect(engine.find('Second', 'Unexisting')).toBeNull()
    })
  })
})
