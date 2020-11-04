import { get, set } from 'object-path-immutable'

import { str } from '../debug'
import { union, any, all } from './result'

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
 * Executable representation of a requisite chain.
 */
class Requisites<I extends {}> {
  constructor(chain: RequisiteChain<I>) {
    Requisites.validateChain(chain)
    this.chain = chain
  }

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
   * Transformation
   * --------------
   */

  public alter(
    refs: string[],
    modify: (chain: RequisiteChain<I>) => RequisiteChain<I>
  ) {
    const path = this.findPath(...refs)
    const chain = this.getChain(path)

    this.chain = set(this.chain, path, modify(chain))

    // return chainable
    return this
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
   * State
   * -----
   */

  /**
   * Create a copy of this instance with fresh execution states.
   */
  public clone = () => new Requisites(this.chain)

  /**
   * Retrieve the last partial for a provided chain
   */
  public getLastPartial = (chain: RequisiteChain<I> = this.chain) =>
    this.partials.find(([compare]) => chain === compare)

  /**
   * Debugging
   * ---------
   */

  /**
   * Direct assessor for a given requisite chain item.
   */
  public getChain(path?: string | Array<string | number>) {
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
  private processReferences(
    chain: RequisiteChain<I>,
    refs: string[][],
    path: Array<string | number>
  ) {
    const ref = []

    if ('title' in chain) ref.push(chain.title)
    if ('description' in chain) ref.push(chain.description)

    // register only references to referencible chains.
    if (ref.length) {
      // alter refs for posterior use.
      refs.push(ref)
      this.references.unshift([refs, path, chain])
    }

    const kind = 'all' in chain ? 'all' : 'any' in chain ? 'any' : null

    if (kind) {
      const children = Requisites.getChildren(chain)

      for (let i = 0; i < children.length; i++) {
        this.processReferences(children[i], [...refs], [...path, kind, i])
      }
    }
  }

  /**
   * Find the chain item reference based on comparison of composed references.
   */
  private findReference(...refs: string[]) {
    // build up refereces, if using for the first time.
    if (typeof this.references === 'undefined') {
      this.references = []
      this.processReferences(this.chain, [], [])
    }

    const reference = this.references
      .filter(([path]) => path.length === refs.length)
      .find(([path]) =>
        path.every((options, i) => options.some((option) => option === refs[i]))
      )

    if (!reference) {
      throw new Error(`Could not find chain at ${refs}`)
    }

    return reference
  }

  /**
   * Find the direct chain item paths based on comparison of composed references.
   */
  public findPath = (...refs: string[]) => this.findReference(...refs)[1]

  /**
   * Assessor for requisite chain items based on comparision of composed references.
   */
  public find = (...refs: string[]) => this.findReference(...refs)[2]

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
