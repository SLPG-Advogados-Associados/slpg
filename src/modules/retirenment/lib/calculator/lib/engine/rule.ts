import { CalculatorInput } from '../../types'
import type { Possibility } from './possibility'

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
   * Execute all possibilities, and return results.
   */
  public execute(input: CalculatorInput) {
    return [
      this,
      this.possibilities.map(
        (possibility) => [possibility, possibility.execute(input)] as const
      ),
    ] as const
  }
}

export { Rule }
