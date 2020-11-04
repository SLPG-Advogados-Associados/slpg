import { r } from '../test-utils'

import { CalculatorInput } from '../../types'
import { RequisiteChain } from './types'
import { Rule } from './rule'
import { Possibility } from './possibility'
import { Requisites } from './requisites'

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

  describe('isSatisfied', () => {
    it.each([
      [[''], '', true],
      [['80^90'], '', true],
      [[''], '80^90', true],
      [['60^70'], '80^90', false],
      [['60^70', '85^87'], '80^90', true],
    ])('%s satisfied within %s: %s', (results, constraint, satisfied) => {
      const { from, to } = r(constraint)

      const chain = { executor: () => results.map(r) }
      const requisites = new Requisites<CalculatorInput>(chain)

      const possibility = new Possibility({
        title: 'Possibility',
        description: 'Possibility description',
        requisites,
      })

      const rule = new Rule({
        title: 'Rule',
        description: 'Rule description',
        promulgation: from,
        due: to,
        possibilities: [possibility],
      })

      rule.execute(possibility, {} as CalculatorInput)

      expect(rule.isSatisfied(possibility, chain)).toBe(satisfied)
    })
  })

  describe('isSatisfiable', () => {
    const input = {} as CalculatorInput

    const setup = (chain: RequisiteChain<{}>) => {
      const requisites = new Requisites<CalculatorInput>(chain)

      const possibility = new Possibility({
        title: 'Possibility',
        description: 'Possibility description',
        requisites,
      })

      const rule = new Rule({
        title: 'Rule',
        description: 'Rule description',
        promulgation: new Date('2000'),
        possibilities: [possibility],
      })

      return { chain, possibility, rule }
    }

    describe('root', () => {
      it('should be false when no result available', () => {
        const { chain, possibility, rule } = setup({ executor: () => [] })
        rule.execute(possibility, input)
        expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
      })

      it('should be false when not satisfiable', () => {
        const { rule, possibility, chain } = setup({ executor: () => [{}] })

        expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
      })

      it('should be true when satisfiable with result', () => {
        const { rule, possibility, chain } = setup({
          executor: () => [{}],
          satisfiable: () => true,
        })
        rule.execute(possibility, input)
        expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
      })
    })

    describe('nested', () => {
      describe('all', () => {
        it('should be false when all chilren are unsatisfiable', () => {
          const { rule, possibility, chain } = setup({
            all: [{ executor: () => [{}] }, { executor: () => [{}] }],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
        })

        it('should be false when one child is unsatisfiable', () => {
          const { rule, possibility, chain } = setup({
            all: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => false },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
        })

        it('should be false when parent is unsatisfiable', () => {
          const { rule, possibility, chain } = setup({
            satisfiable: () => false,
            all: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => true },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
        })

        it('should be true when all children are satisfiable', () => {
          const { rule, possibility, chain } = setup({
            all: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => true },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
        })

        it('should be true when parent is satisfiable', () => {
          const { rule, possibility, chain } = setup({
            satisfiable: () => true,
            all: [
              { executor: () => [{}], satisfiable: () => false },
              { executor: () => [{}], satisfiable: () => false },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
        })
      })

      describe('any', () => {
        it('should be false when all chilren are unsatisfiable', () => {
          const { rule, possibility, chain } = setup({
            any: [{ executor: () => [{}] }, { executor: () => [{}] }],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
        })

        it('should be true when at least one child is satisfiable', () => {
          const { rule, possibility, chain } = setup({
            any: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => false },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
        })

        it('should be false when parent is unsatisfiable', () => {
          const { rule, possibility, chain } = setup({
            satisfiable: () => false,
            any: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => true },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeFalse()
        })

        it('should be true when all children are satisfiable', () => {
          const { rule, possibility, chain } = setup({
            any: [
              { executor: () => [{}], satisfiable: () => true },
              { executor: () => [{}], satisfiable: () => true },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
        })

        it('should be true when parent is satisfiable', () => {
          const { rule, possibility, chain } = setup({
            satisfiable: () => true,
            any: [
              { executor: () => [{}], satisfiable: () => false },
              { executor: () => [{}], satisfiable: () => false },
            ],
          })
          rule.execute(possibility, input)
          expect(rule.isSatisfiable(possibility, chain)).toBeTrue()
        })
      })
    })
  })
})
