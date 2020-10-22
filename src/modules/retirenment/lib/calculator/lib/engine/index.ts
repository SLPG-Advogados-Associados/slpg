import { get } from 'object-path-immutable'

import { str } from '../debug'
import { union, any, all } from './result'

type Meta = {
  title?: string
  description?: string
  debug?: ((...args: unknown[]) => void) | boolean
  lastResult?: RequisiteResult[]
}

export type RequisiteResult = { from?: Date; to?: Date }
export type RequisiteExecutor<I extends {}> = (input: I) => RequisiteResult[]

// @todo: replace as it is deprecated
type Executor<I> = RequisiteExecutor<I>

export type Requisite<I> = Meta & { executor: Executor<I> }
export type RequisiteGroupAny<I> = Meta & { any: RequisiteChain<I>[] }
export type RequisiteGroupAll<I> = Meta & { all: RequisiteChain<I>[] }

export type RequisiteGroup<I> = RequisiteGroupAny<I> | RequisiteGroupAll<I>
export type RequisiteChain<I> = RequisiteGroup<I> | Requisite<I>

type Partial<I extends {}> = [RequisiteChain<I>, RequisiteResult[], I]

type Reference<I extends {}> = [string[][], RequisiteChain<I>]

class Engine<I extends {}> {
  public chain: RequisiteChain<I>

  public partials: Partial<I>[] = []
  private references: Reference<I>[]

  constructor(chain: RequisiteChain<I>) {
    if (!Engine.validChain(chain)) {
      throw new Error('Provided requisite chain is invalid')
    }

    this.chain = chain
  }

  /**
   * Verifies if a provided chain is valid.
   */
  private static validChain(chain: RequisiteChain<unknown>) {
    return chain && ('executor' in chain || 'all' in chain || 'any' in chain)
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

  private executeChain(chain: RequisiteChain<I>, input: I): RequisiteResult[] {
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

    if (!('any' in chain) && !('all' in chain) && !chain.executor) {
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

    const childs = 'all' in chain ? chain.all : 'any' in chain ? chain.any : []

    for (const child of childs) {
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
    const children =
      'any' in chain ? chain.any : 'all' in chain ? chain.all : []

    for (const child of children) {
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
 * Shortcut Engine creation/executor.
 */
const evaluate = <I extends {}>(input, chain: RequisiteChain<I>) =>
  new Engine(chain).execute(input)

export { Engine, evaluate }
