import { Engine, RequisiteGroup } from './engine'
import { d } from './test-utils'

const o = expect.objectContaining

describe('retirement/calculator/engine', () => {
  const r = {
    truthy: {
      title: 'Truthy',
      executor: jest.fn(() => ({ satisfied: true })),
    },

    falsy: {
      title: 'Truthy',
      executor: jest.fn(() => ({ satisfied: false })),
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
    })
  })

  describe('input & params', () => {
    it('should provide any execution input to requisites', () => {
      const input = {}
      new Engine(r.truthy).execute(input)
      expect(r.truthy.executor).toHaveBeenCalledWith(input)
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
})
