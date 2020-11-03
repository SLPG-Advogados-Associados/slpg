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
   * Partial results, attached to chain nodes.
   */
  public partials: Partial<I>[] = []

  /**
   * Map of chain nodes, based on unique textual references.
   */
  private references: Reference<I>[]

  constructor(chain: RequisiteChain<I>) {
    Requisites.validateChain(chain)
    this.chain = chain
  }

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
   *
   */
  public static getName<I extends unknown>(chain: RequisiteChain<I>) {
    return chain.title ?? chain.description ?? null
  }

  public static getChildren<I extends unknown>(chain: RequisiteChain<I>) {
    return 'all' in chain ? chain.all : 'any' in chain ? chain.any : []
  }

  public static isSatisfied<I extends unknown>(
    chain: RequisiteChain<I>,
    constraint: Period
  ) {
    return chain.lastResult.length
      ? chain.lastResult.some(
          (result) =>
            overlaps(constraint, result) || overlaps(result, constraint)
        )
      : false
  }

  public static isSatisfiable<I extends unknown>(chain: RequisiteChain<I>) {
    const result = chain.lastResult ?? []

    // early return if not even a result is available.
    if (!result.length) return false

    // early return if we know this chain level is already satisfiable
    if (result.length && chain.satisfiable && chain.satisfiable(result)) {
      return true
    }

    return 'all' in chain || 'any' in chain
      ? Requisites.getChildren(chain)['all' in chain ? 'every' : 'some'](
          Requisites.isSatisfiable
        )
      : false
  }

  public static satisfy = {
    startBefore: (date: Date) => (result: Period[]) =>
      result.length ? result.some(({ from }) => !from || from < date) : false,
  }

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

  private executeGroup(chain: RequisiteGroup<I>, input: I) {
    if ('any' in chain) return this.executeGroupAny(chain, input)
    if ('all' in chain) return this.executeGroupAll(chain, input)
  }

  private executeChain(chain: RequisiteChain<I>, input: I): Period[] {
    const result =
      'any' in chain || 'all' in chain
        ? this.executeGroup(chain, input)
        : chain.executor(input)

    if (chain.debug) {
      typeof chain.debug === 'function'
        ? chain.debug({ chain, result, input })
        : // eslint-disable-next-line no-console
          console.log({ chain, result, input })
    }

    // save partials for posterior usage.
    chain.lastResult = result
    // save partials for further analysis
    this.partials.push([chain, result, input])

    return union(result)
  }

  public execute = (input: I) => this.executeChain(this.chain, input)

  /**
   * Assessor for a given requisite chain item.
   */
  public getChain<Chain extends RequisiteChain<I>>(path?: string) {
    const chain = path ? get(this.chain, path) : this.chain

    if (!chain) {
      throw new Error(`Could not find chain at "${path}"`)
    }

    if (!Requisites.validChain(chain)) {
      throw new Error(`Invalid chain found at "${path}"`)
    }

    return chain as Chain
  }

  /**
   * Build up human references.
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
