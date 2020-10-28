import { all } from './engine/result'
import { Possibility, CalculatorInput } from '../types'

export interface RuleConfig {
  title: string
  description: string
  due?: Date
  promulgation: Date
  possibilities: Possibility[]
}

/**
 * A law ruling and it's related retirenment possibilities.
 */
class Rule {
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

  constructor(config: RuleConfig) {
    this.title = config.title
    this.description = config.description
    this.promulgation = config.promulgation
    this.due = config.due
    this.possibilities = config.possibilities
  }

  /**
   * Execute a possibility requisites respecting promulgation/due dates.
   */
  public executePossibility(index: number, input: CalculatorInput) {
    return all([
      [{ from: this.promulgation, to: this.due }],
      this.possibilities[index].requisites.execute(input),
    ])
  }

  /**
   * Execute all possibilities, and return results.
   */
  public execute(input: CalculatorInput) {
    return [
      this,
      this.possibilities.map(
        (possibility, i) =>
          [possibility, this.executePossibility(i, input)] as const
      ),
    ] as const
  }
}

export { Rule }
