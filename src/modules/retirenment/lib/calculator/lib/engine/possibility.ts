import { CalculatorInput } from '../../types'

import type { Requisites } from './requisites'

interface PossibilityInput {
  /**
   * A human title for the possibility.
   */
  title: string

  /**
   * The possibility description text in law.
   */
  description: string

  /**
   * The agnostic requisites for the possibility satisfaction.
   */
  requisites: Requisites<CalculatorInput>
}

/**
 * Executable representation of a retirement possibility.
 */
class Possibility implements PossibilityInput {
  constructor(config: PossibilityInput) {
    this.title = config.title
    this.description = config.description
    this.requisites = config.requisites
  }

  public title: string
  public description: string
  public requisites: Requisites<CalculatorInput>

  /**
   * Execute the possibility's requisites.
   */
  public execute = (input: CalculatorInput) => this.requisites.execute(input)

  /**
   * Clone the possibility and it's stateful assets.
   */
  public clone = () =>
    new Possibility({ ...this, requisites: this.requisites.clone() })
}

export { Possibility }
