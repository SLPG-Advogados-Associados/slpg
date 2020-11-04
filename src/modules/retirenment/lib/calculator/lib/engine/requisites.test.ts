import { r } from '../test-utils'

import { Requisites } from './requisites'
import { RequisiteGroup } from './types'

describe('retirement/calculator/requisites', () => {
  const chains = {
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
      executor: jest.fn(() => [r('80^')]),
    },

    withEnd: {
      title: 'With end',
      executor: jest.fn(() => [r('^90')]),
    },
  }

  beforeEach(jest.clearAllMocks)

  it('should instantiate requisites', () => {
    const instance = new Requisites(chains.always)
    expect(instance).toBeInstanceOf(Requisites)
  })

  it('should throw for invalid chain', () => {
    expect(() => new Requisites({} as RequisiteGroup<{}>)).toThrow(
      'chain is invalid'
    )
  })

  describe('execution', () => {
    it('should evaluate single requisites', () => {
      expect(new Requisites(chains.always).execute({})).toEqual([{}])
      expect(new Requisites(chains.never).execute({})).toEqual([])
    })

    describe('any', () => {
      it('should evaluate ANY requisites list with single requisite', () => {
        const instance = new Requisites({ any: [chains.always] })
        expect(instance.execute({})).toEqual([{}])
      })

      it('should evaluate ANY requisites list with multiple requisites', () => {
        const instance = new Requisites({ any: [chains.always, chains.never] })
        expect(instance.execute({})).toEqual([{}])
      })

      it('should evaluate ANY requisites list with single unsatisfied', () => {
        const instance = new Requisites({ any: [chains.never] })
        expect(instance.execute({})).toEqual([])
      })
    })

    describe('all', () => {
      it('should evaluate ALL requisites list with single requisite', () => {
        const instance = new Requisites({ all: [chains.always] })
        expect(instance.execute({})).toEqual([{}])
      })

      it('should evaluate ALL requisites list with multiple requisites', () => {
        const instance = new Requisites({ all: [chains.always, chains.never] })
        expect(instance.execute({})).toEqual([])
      })
    })

    describe('nested', () => {
      it('should evaluate nested requisites', () => {
        let chain: RequisiteGroup<{}>

        chain = { all: [chains.always, { any: [chains.never] }] }
        expect(new Requisites(chain).execute({})).toEqual([])

        chain = { any: [chains.always, { all: [chains.never] }] }
        expect(new Requisites(chain).execute({})).toEqual([{}])

        chain = { all: [chains.always, { any: [chains.never, chains.always] }] }
        expect(new Requisites(chain).execute({})).toEqual([{}])

        chain = { all: [chains.always, { all: [chains.never, chains.always] }] }
        expect(new Requisites(chain).execute({})).toEqual([])

        chain = { any: [chains.never, { all: [chains.always] }] }
        expect(new Requisites(chain).execute({})).toEqual([{}])

        chain = {
          any: [{ any: [{ any: [{ all: [chains.always, chains.never] }] }] }],
        }
        expect(new Requisites(chain).execute({})).toEqual([])
      })

      it('should evaluate combinations', () => {
        let chain: RequisiteGroup<{}>

        // any

        chain = { any: [chains.withStart, chains.never] }
        expect(new Requisites(chain).execute({})).toEqual([r('80^')])

        chain = { any: [chains.never, chains.withEnd] }
        // res = { satisfied: true, satisfiedAt: d('2000') }
        expect(new Requisites(chain).execute({})).toEqual([r('^90')])

        chain = { any: [chains.withStart, chains.withEnd] }
        // res = { satisfied: true, satisfiedAt: d('2000') }
        expect(new Requisites(chain).execute({})).toEqual([r('^')])

        // all

        chain = { all: [chains.withStart, chains.always] }
        expect(new Requisites(chain).execute({})).toEqual([r('80^')])

        chain = { all: [chains.always, chains.withEnd] }
        expect(new Requisites(chain).execute({})).toEqual([r('^90')])

        chain = { all: [chains.withStart, chains.withEnd] }
        // res = { satisfied: true, satisfiedAt: d('2000') }
        expect(new Requisites(chain).execute({})).toEqual([r('80^90')])
      })
    })

    describe('input & params', () => {
      it('should provide any execution input to requisites', () => {
        const input = {}
        new Requisites(chains.always).execute(input)
        expect(chains.always.executor).toHaveBeenCalledWith(input)
      })
    })
  })

  describe('state', () => {
    describe('clone', () => {
      it('should be possible to clone, erasing states', () => {
        const instance = new Requisites(chains.always)
        expect(instance.getLastPartial()).toBeUndefined()

        instance.execute({})
        expect(instance.getLastPartial()).not.toBeUndefined()

        const clone = instance.clone()

        expect(instance.getLastPartial()).not.toBeUndefined()
        expect(clone.getLastPartial()).toBeUndefined()

        clone.execute({})
        expect(clone.getLastPartial()).not.toBeUndefined()
      })
    })

    describe('alter', () => {
      it('should be possible to alter chain without affecting references', () => {
        const instance = new Requisites(chains.always)

        const clone = instance
          .clone()
          .alter(['Always'], (chain) => ({ ...chain, executor: () => [] }))

        expect(instance.execute({})).toEqual([{}])
        expect(clone.execute({})).toEqual([])
      })
    })

    describe('getLastPartial', () => {
      it('should save partial results for root chain', () => {
        const input = {}
        const instance = new Requisites(chains.always)
        instance.execute(input)

        expect(instance.getLastPartial(chains.always)).toMatchObject([
          chains.always,
          [{}],
          input,
        ])
      })

      it('should save partial results for nested chain', () => {
        const input = {}
        const instance = new Requisites({ any: [chains.always, chains.never] })
        instance.execute(input)

        expect(instance.getLastPartial(chains.always)).toMatchObject([
          chains.always,
          [{}],
          input,
        ])

        expect(instance.getLastPartial(chains.never)).toMatchObject([
          chains.never,
          [],
          input,
        ])
      })
    })
  })

  describe('debug & test', () => {
    describe('getChain', () => {
      let chain: RequisiteGroup<{}>
      let instance: Requisites<{}>

      beforeEach(() => {
        chain = {
          all: [
            chains.always,
            {
              any: [chains.never, { all: [chains.withStart, chains.withEnd] }],
            },
          ],
        }

        instance = new Requisites(chain)
      })

      it('should fetch first level nested chains', () => {
        expect(instance.getChain('')).toBe(chain)
      })

      it('should fetch nested chains', () => {
        expect(instance.getChain('all.0')).toBe(chains.always)
        expect(instance.getChain('all.1.any.1.all.0')).toBe(chains.withStart)
      })

      it('should throw for missing chain paths', () => {
        const err = 'Could not find chain'

        expect(() => instance.getChain('all.2')).toThrow(err)
        expect(() => instance.getChain('something.else')).toThrow(err)
      })

      it('should throw for invalid chain paths', () => {
        const err = 'Invalid chain found at'
        expect(() => instance.getChain('all.1.any')).toThrow(err)
      })
    })

    describe('findPath', () => {
      let instance: Requisites<{}>

      beforeEach(() => {
        instance = new Requisites({
          all: [
            chains.always,
            {
              title: 'Second',
              any: [chains.never, { all: [chains.withStart] }],
            },
            { any: [{ all: [chains.withEnd] }] },
          ],
        })
      })

      it('should find direct reference', () => {
        expect(instance.findPath('Always')).toEqual(['all', 0])
      })

      it('should find nested references', () => {
        expect(instance.findPath('Second', 'Never')).toEqual([
          'all',
          1,
          'any',
          0,
        ])
      })

      it('should find nested references with skipping steps', () => {
        expect(instance.findPath('Second', 'With start')).toEqual([
          'all',
          1,
          'any',
          1,
          'all',
          0,
        ])
      })

      it('should find based on description also', () => {
        expect(instance.findPath('A requisite which is always true')).toEqual([
          'all',
          0,
        ])
      })

      it('should throw when chain not found', () => {
        expect(() => instance.findPath('Unexisting')).toThrow('Could not find')

        expect(() => instance.findPath('Second', 'Unexisting')).toThrow(
          'Could not find'
        )
      })
    })

    describe('find', () => {
      let instance: Requisites<{}>

      beforeEach(() => {
        instance = new Requisites({
          all: [
            chains.always,
            {
              title: 'Second',
              any: [chains.never, { all: [chains.withStart] }],
            },
            { any: [{ all: [chains.withEnd] }] },
          ],
        })
      })

      it('should find direct reference', () => {
        expect(instance.find('Always')).toBe(chains.always)
      })

      it('should find nested references', () => {
        expect(instance.find('Second', 'Never')).toBe(chains.never)
      })

      it('should find nested references with skipping steps', () => {
        expect(instance.find('Second', 'With start')).toBe(chains.withStart)
      })

      it('should find based on description also', () => {
        expect(instance.find('A requisite which is always true')).toBe(
          chains.always
        )
      })

      it('should throw when chain not found', () => {
        expect(() => instance.find('Unexisting')).toThrow('Could not find')

        expect(() => instance.find('Second', 'Unexisting')).toThrow(
          'Could not find'
        )
      })
    })
  })
})
