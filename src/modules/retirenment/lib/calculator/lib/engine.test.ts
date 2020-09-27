import { Engine, RequisiteGroup, RequisiteResult } from './engine'
import { d } from './test-utils'

const o = expect.objectContaining

describe('retirement/calculator/engine', () => {
  const r = {
    truthy: {
      title: 'Truthy',
      description: 'A simple default satisfiable rule',
      executor: jest.fn(() => ({ satisfied: true })),
    },

    falsy: {
      title: 'Falsy',
      executor: jest.fn(() => ({ satisfied: false })),
    },

    truthyLate: {
      title: 'Truthy late',
      executor: jest.fn(() => ({ satisfied: true, satisfiedAt: d('2000') })),
    },

    falsyEarly: {
      title: 'Falsy early',
      executor: jest.fn(() => ({ satisfied: false, satisfiedAt: d('1990') })),
    },

    satisfiableLate: {
      title: 'Satisfiable late',
      executor: jest.fn(() => ({
        satisfied: false,
        satisfiable: true,
        satisfiableAt: d('2000'),
      })),
    },

    satisfiableEarly: {
      title: 'Satisfiable early',
      executor: jest.fn(() => ({
        satisfied: false,
        satisfiable: true,
        satisfiableAt: d('1990'),
      })),
    },
  }

  beforeEach(jest.clearAllMocks)

  it('should instantiate an engine', () => {
    const engine = new Engine(r.truthy)
    expect(engine).toBeInstanceOf(Engine)
  })

  it('should evaluate single requisites', () => {
    expect(new Engine(r.truthy).execute({})).toEqual(o({ satisfied: true }))
    expect(new Engine(r.falsy).execute({})).toEqual(o({ satisfied: false }))
  })

  describe('any', () => {
    it('should evaluate ANY requisites list with single requisite', () => {
      const engine = new Engine({ any: [r.truthy] })
      expect(engine.execute({})).toEqual(o({ satisfied: true }))
    })

    it('should evaluate ANY requisites list with multiple requisites', () => {
      const engine = new Engine({ any: [r.truthy, r.falsy] })
      expect(engine.execute({})).toEqual(o({ satisfied: true }))
    })
  })

  describe('all', () => {
    it('should evaluate ALL requisites list with single requisite', () => {
      const engine = new Engine({ all: [r.truthy] })
      expect(engine.execute({})).toEqual(o({ satisfied: true }))
    })

    it('should evaluate ALL requisites list with multiple requisites', () => {
      const engine = new Engine({ all: [r.truthy, r.falsy] })
      expect(engine.execute({})).toEqual(o({ satisfied: false }))
    })
  })

  describe('nested', () => {
    it('should evaluate nested requisites', () => {
      let req: RequisiteGroup<{}>

      req = { all: [r.truthy, { any: [r.falsy] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: false }))

      req = { any: [r.truthy, { all: [r.falsy] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: true }))

      req = { all: [r.truthy, { any: [r.falsy, r.truthy] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: true }))

      req = { all: [r.truthy, { all: [r.falsy, r.truthy] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: false }))

      req = { any: [r.falsy, { all: [r.truthy] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: true }))

      req = { any: [{ any: [{ any: [{ all: [r.truthy, r.falsy] }] }] }] }
      expect(new Engine(req).execute({})).toEqual(o({ satisfied: false }))

      req = { any: [{ all: [r.truthy] }] }
    })

    it('should evaluate satisfaction states', () => {
      let req: RequisiteGroup<{}>
      let res: RequisiteResult

      // any

      req = { any: [r.truthyLate, r.falsyEarly] }
      res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { any: [r.falsy, r.truthyLate] }
      res = { satisfied: true, satisfiedAt: d('2000') }
      expect(new Engine(req).execute({})).toMatchObject(res)

      // all

      req = { all: [r.truthyLate, r.falsyEarly] }
      res = { satisfied: false, satisfiedAt: undefined }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { all: [r.falsy, r.truthyLate] }
      res = { satisfied: false, satisfiedAt: undefined }
      expect(new Engine(req).execute({})).toMatchObject(res)
    })

    it('should evaluate satisfiables', () => {
      let req: RequisiteGroup<{}>
      let res: RequisiteResult

      // any

      req = { any: [r.falsy, r.satisfiableEarly] }
      res = { satisfied: false, satisfiable: true, satisfiableAt: d('1990') }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { any: [r.satisfiableLate, r.satisfiableEarly] }
      res = { satisfied: false, satisfiable: true, satisfiableAt: d('1990') }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { any: [r.truthyLate, r.satisfiableEarly] }
      res = {
        satisfied: true,
        satisfiable: true,
        satisfiedAt: d('2000'),
        satisfiableAt: d('2000'),
      }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { any: [r.truthy, r.truthyLate] }
      res = {
        satisfied: true,
        satisfiedAt: d('2000'),
        satisfiable: false,
        satisfiableAt: undefined,
      }
      expect(new Engine(req).execute({})).toMatchObject(res)

      // all

      req = { all: [r.falsy, r.satisfiableEarly] }
      res = { satisfied: false, satisfiable: false, satisfiableAt: undefined }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { all: [r.satisfiableLate, r.satisfiableEarly] }
      res = { satisfied: false, satisfiable: true, satisfiableAt: d('2000') }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { all: [r.truthyLate, r.satisfiableEarly] }
      res = {
        satisfied: false,
        satisfiable: true,
        satisfiedAt: undefined,
        satisfiableAt: d('2000'),
      }
      expect(new Engine(req).execute({})).toMatchObject(res)

      req = { all: [r.truthy, r.truthyLate] }
      res = {
        satisfied: true,
        satisfiedAt: d('2000'),
        satisfiable: false,
        satisfiableAt: undefined,
      }
      expect(new Engine(req).execute({})).toMatchObject(res)
    })
  })

  describe('input & params', () => {
    it('should provide any execution input to requisites', () => {
      const input = {}
      new Engine(r.truthy).execute(input)
      expect(r.truthy.executor).toHaveBeenCalledWith(input)
    })
  })

  describe('lazy executor', () => {
    it('should be possible to define executors in lazy format', () => {
      const fn = jest.fn()
      const factory = jest.fn(() => fn)
      const input = {}

      new Engine({ executor: [factory, [1, 2, 3]] }).execute(input)

      expect(factory).toHaveBeenCalledWith(1, 2, 3)
      expect(fn).toHaveBeenCalledWith(input)
    })
  })

  describe('result', () => {
    const expected = {
      'at 1990': {
        satisfied: true,
        satisfiedAt: d('1990'),
        context: { key: 'at 1990' },
      },
    }

    const chains = {
      'at 1990': { executor: () => expected['at 1990'] },
    }

    it('should return result info when root chain', () => {
      expect(new Engine(chains['at 1990']).execute({})).toMatchObject(
        expected['at 1990']
      )
    })

    it('should return result info when nested chain', () => {
      expect(
        new Engine({ any: [chains['at 1990']] }).execute({})
      ).toMatchObject({
        ...expected['at 1990'],
        context: [[chains['at 1990'], expected['at 1990'].context]],
      })
    })

    it('should save flat partial results when root chain', () => {
      const engine = new Engine(chains['at 1990'])

      engine.execute({})

      expect(engine.partials).toMatchObject([
        [chains['at 1990'], expected['at 1990'], {}],
      ])
    })

    it('should save flat partial results when nested chain', () => {
      const chain = { any: [chains['at 1990']] }
      const engine = new Engine(chain)

      const result = engine.execute({})

      expect(engine.partials).toMatchObject([
        [chains['at 1990'], expected['at 1990'], {}],
        [chain, result, {}],
      ])
    })
  })

  describe('getChain', () => {
    const engine = new Engine({
      all: [r.truthy, { any: [r.falsy, { all: [r.satisfiableEarly] }] }],
    })

    it('should fetch first level nested chains', () => {
      expect(engine.getChain('')).toHaveProperty('all')
    })

    it('should fetch nested chains', () => {
      expect(engine.getChain('all.0')).toBe(r.truthy)
      expect(engine.getChain('all.1.any.1.all.0')).toBe(r.satisfiableEarly)
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
        r.truthy,
        { title: 'Second', any: [r.falsy, { all: [r.satisfiableEarly] }] },
        { any: [{ all: [r.truthyLate] }] },
      ],
    })

    it('should not find unexisting reference', () => {
      expect(engine.find('Unexisting')).toBeNull()
    })

    it('should find direct reference', () => {
      expect(engine.find('Truthy')).toBe(r.truthy)
    })

    it('should find nested references', () => {
      expect(engine.find('Second', 'Falsy')).toBe(r.falsy)
    })

    it('should find nested references with skipping steps', () => {
      expect(engine.find('Truthy late')).toBe(r.truthyLate)
    })

    it('should find based on description also', () => {
      expect(engine.find('A simple default satisfiable rule')).toBe(r.truthy)
    })
  })
})
