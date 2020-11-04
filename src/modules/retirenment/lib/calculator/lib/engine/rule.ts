import { Requisites } from './requisites'
import type { Possibility } from './possibility'
import type { RequisiteChain, Period } from './types'

import { CalculatorInput } from '../../types'
import { all, overlaps } from './result'

interface RuleInput {
  title: string
  description: string
  due?: Date
  promulgation: Date
  possibilities: Possibility[]
}

/**
 * A law ruling and it's related retirenment possibilities.
 */
class Rule implements RuleInput {
  /**
   * A human title of the rule.
   */
  public title: string

  /**
   * A description of rule the effect.
   */
  public description: string

  /**
   * Date when this rule became valid.
   */
  public promulgation: Date

  /**
   * Date when the rule became invalid.
   */
  public due?: Date

  /**
   * Retirenment possibilities described by this rule.
   */
  public possibilities: Possibility[]

  constructor(config: RuleInput) {
    this.title = config.title
    this.description = config.description
    this.promulgation = config.promulgation
    this.due = config.due
    this.possibilities = config.possibilities
  }

  /**
   * Execute a given possibility, constrained to the rule's validity period.
   */
  public execute = (possibility: Possibility, input: CalculatorInput) =>
    all([
      [{ from: this.promulgation, to: this.due }],
      possibility.execute(input),
    ])

  /**
   * Computes the rule's contraint period.
   */
  public getConstraint = (): Period => ({
    from: this.promulgation,
    to: this.due,
  })

  /**
   * Check if a given possibility/chain combination is satisfied withing this
   * rule validity.
   */
  public isSatisfied(
    { requisites }: Possibility,
    chain: RequisiteChain<CalculatorInput> = requisites.chain
  ) {
    const constraint = this.getConstraint()
    const [_, lastResult] = requisites.getLastPartial(chain) || []

    if (!lastResult) {
      throw new Error('Could not find existing result for chain.')
    }

    return lastResult.length
      ? lastResult.some((period) => overlaps(constraint, period))
      : false
  }

  /**
   * Check if a given possibility/chain combination is satisfiable within this rule.
   */
  public isSatisfiable(
    possibility: Possibility,
    chain: RequisiteChain<CalculatorInput> = possibility.requisites.chain
  ) {
    const constraint = this.getConstraint()
    const { requisites } = possibility
    const [_, lastResult = []] = requisites.getLastPartial(chain) || []

    if (!lastResult) {
      throw new Error('Could not find existing result for chain.')
    }

    console.log({ lastResult, chain, possibility })

    // early return if not even a result is available.
    if (!lastResult.length) return false

    // early return if this level has satisfiable opinion.
    if (chain.satisfiable) {
      return chain.satisfiable(lastResult)
    }

    // define combinatory method for children, if applicable.
    const method = 'all' in chain ? 'every' : 'any' in chain ? 'some' : null

    return method
      ? Requisites.getChildren(chain)[method]((child) =>
          this.isSatisfiable(possibility, child)
        )
      : false
  }
}

export { Rule }
