import { get } from 'object-path-immutable'

import { str } from '../debug'
import { union, any, all, overlaps } from './result'

import {
  Period,
  RequisiteGroupAny,
  RequisiteGroupAll,
  RequisiteGroup,
  RequisiteChain,
  Partial,
  Reference,
} from './types'

/**
 * Executable representation of requisites.
 */
class Requisites<I extends {}> {
  /**
   * The chain of requisites.
   */
  public chain: RequisiteChain<I>

  /**
   * Map of chain nodes, based on unique textual references.
   */
  private references: Reference<I>[]

  /**
   * States
   * ------
   */

  /**
   * Partial results, attached to chain nodes.
   */
  private partials: Partial<I>[] = []

  /**
   * Creates a new requisites instance.
   */
  constructor(chain: RequisiteChain<I>) {
    Requisites.validateChain(chain)
    this.chain = chain
  }

  /**
   * Validation
   * ----------
   */

  /**
   * Verifies if a chain is valid.
   */
  private static validChain<I extends unknown>(chain: RequisiteChain<I>) {
    return chain && ('executor' in chain || 'all' in chain || 'any' in chain)
  }

  /**
   * Validates if a chain.
   */
  private static validateChain<I extends unknown>(chain: RequisiteChain<I>) {
    // Ensure provided chain is valid.
    if (!Requisites.validChain(chain)) {
      throw new Error('Provided requisite chain is invalid')
    }

    // Ensure every possible child chain is also valid.
    Requisites.getChildren(chain).forEach(Requisites.validateChain)
  }

  /**
   * Static helpers
   * --------------
   */

  /**
   * Get a human name for a chain, if existing.
   */
  public static getName<I extends unknown>(chain: RequisiteChain<I>) {
    return chain.title ?? chain.description ?? null
  }

  /**
   * Get the children of a chain, if any.
   */
  public static getChildren<I extends unknown>(chain: RequisiteChain<I>) {
    return 'all' in chain ? chain.all : 'any' in chain ? chain.any : []
  }

  /**
   * Satisfaction assessors.
   */
  public static satisfy = {
    startBefore: (date: Date) => (result: Period[]) =>
      result.length ? result.some(({ from }) => !from || from < date) : false,
  }

  /**
   * Execution
   * ---------
   */

  /**
   * Execute an ANY group using union logic.
   */
  private executeGroupAny = (chain: RequisiteGroupAny<I>, input: I) =>
    any(chain.any.map((requisite) => this.executeChain(requisite, input)))

  /**
   * Execute an ALL group using intersection logic.
   */
  private executeGroupAll = (chain: RequisiteGroupAll<I>, input: I) =>
    all(chain.all.map((requisite) => this.executeChain(requisite, input)))

  /**
   * Execute a group chain.
   */
  private executeGroup = (chain: RequisiteGroup<I>, input: I) =>
    'any' in chain
      ? this.executeGroupAny(chain, input)
      : this.executeGroupAll(chain, input)

  /**
   * Execute a chain.
   */
  private executeChain(chain: RequisiteChain<I>, input: I): Period[] {
    const result =
      'executor' in chain
        ? chain.executor(input)
        : this.executeGroup(chain, input)

    if (chain.debug) {
      typeof chain.debug === 'function'
        ? chain.debug({ chain, result, input })
        : // eslint-disable-next-line no-console
          console.log({ chain, result, input })
    }

    // save partial result state for future consumption.
    this.partials.unshift([chain, result, input])

    return union(result)
  }

  /**
   * Execute the requisites.
   */
  public execute = (input: I) => this.executeChain(this.chain, input)

  /**
   * State consumption
   * -----------------
   */

  // public clone() {}

  /**
   * Retrieve the last partial for a provided chain
   */
  public getLastPartial = (chain: RequisiteChain<I> = this.chain) =>
    this.partials.find(([compare]) => chain === compare)

  /**
   * Determine if the provided sub-chain is satisfied within provided constraint,
   * given previous result.
   */
  public isSatisfied(chain: RequisiteChain<I>, constraint: Period) {
    const [_, lastResult = []] = this.getLastPartial(chain) || []

    return lastResult.length
      ? lastResult.some((period) => overlaps(constraint, period))
      : false
  }

  /**
   * Determine if the provided sub-chain is satisfiable.
   */
  public isSatisfiable(chain: RequisiteChain<I>) {
    const [_, lastResult = []] = this.getLastPartial(chain) || []

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
          this.isSatisfiable(child)
        )
      : false
  }

  /**
   * Debugging
   * ---------
   */

  /**
   * Direct assessor for a given requisite chain item.
   */
  public getChain(path?: string) {
    const chain = path ? get(this.chain, path) : this.chain

    if (!chain) {
      throw new Error(`Could not find chain at "${path}"`)
    }

    if (!Requisites.validChain(chain)) {
      throw new Error(`Invalid chain found at "${path}"`)
    }

    return chain as RequisiteChain<I>
  }

  /**
   * Build up textual chain references.
   */
  private processReferences(chain: RequisiteChain<I>, paths: string[][]) {
    const ref = []

    if ('title' in chain) ref.push(chain.title)
    if ('description' in chain) ref.push(chain.description)

    // register only references to referencible chains.
    if (ref.length) {
      // alter paths for posterior use.
      paths.push(ref)
      this.references.unshift([paths, chain])
    }

    for (const child of Requisites.getChildren(chain)) {
      this.processReferences(child, [...paths])
    }
  }

  /**
   * Assessor for requisite chain items based on comparision of composed references.
   */
  public find(...refs: string[]): RequisiteChain<I> | null {
    // build up refereces, if using for the first time.
    if (typeof this.references === 'undefined') {
      this.references = []
      this.processReferences(this.chain, [])
    }

    const found = this.references
      .filter(([path]) => path.length === refs.length)
      .find(([path]) =>
        path.every((options, i) => options.some((option) => option === refs[i]))
      )

    return found ? found[1] : null
  }

  /**
   * Builds a human-readable result tree in JSON format.
   */
  public resultTree(chain: RequisiteChain<I>) {
    const tree = {}
    const title = str.chain(chain)

    for (const child of Requisites.getChildren(chain)) {
      const [subtitle, subtree] = this.resultTree(child)
      tree[subtitle] = subtree
    }

    return [title, tree] as const
  }

  /**
   * Prints the result tree for debugging.
   */
  public printResults() {
    const [name, tree] = this.resultTree(this.chain)
    // eslint-disable-next-line no-console
    console.log(str.tree({ [name]: tree }))
  }
}

/**
 * Shortcut Requisites creation/executor.
 */
const evaluate = <I extends {}>(input, chain: RequisiteChain<I>) =>
  new Requisites(chain).execute(input)

export { Requisites, evaluate }
