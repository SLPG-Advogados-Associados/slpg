import { either } from 'ramda'
import { get } from 'object-path-immutable'
import { max } from './date'

export type RequisiteResult<C = {}> = {
  /**
   * Wheter the requisite was satisfied.
   */
  satisfied: boolean

  /**
   * Wheter the requisite might be satisfied with more data.
   */
  satisfiable?: boolean

  /**
   * Date when the requisite became satisfied.
   */
  satisfiedAt?: Date

  /**
   * Date when the requisite would became satisfied.
   */
  satisfiableAt?: Date

  /**
   * Extra context available.
   */
  context?: C
}

type Meta = {
  title?: string
  description?: string
  debug?: ((...args: unknown[]) => void) | boolean
}

export type RequisiteExecutor<I extends {}, C = {}> = (
  input: I
) => RequisiteResult<C>

type Executor<I> = RequisiteExecutor<I> | [Function, unknown[]]

export type Requisite<I> = Meta & { executor: Executor<I> }
export type RequisiteGroupAny<I> = Meta & { any: RequisiteChain<I>[] }
export type RequisiteGroupAll<I> = Meta & { all: RequisiteChain<I>[] }

export type RequisiteGroup<I> = RequisiteGroupAny<I> | RequisiteGroupAll<I>
export type RequisiteChain<I> = RequisiteGroup<I> | Requisite<I>

type Partial<I extends {}> = [RequisiteChain<I>, RequisiteResult, I]

const isSatisfied = ({ satisfied }: RequisiteResult) => satisfied
const isSatisfiable = ({ satisfiable }: RequisiteResult) => satisfiable

type Reference<I extends {}> = [string[][], RequisiteChain<I>]

class Engine<I extends {}> {
  public chain: RequisiteChain<I>

  public partials: Partial<I>[] = []
  private references: Reference<I>[]

  constructor(chain: RequisiteChain<I>) {
    this.chain = chain
  }

  private executeGroup(chain: RequisiteGroup<I>, input: I) {
    if ('any' in chain) {
      const results = chain.any.map((item) => this.executeChain(item, input))

      this.partials.push(
        ...results.map(
          (result, i) => [chain.any[i], result, input] as Partial<I>
        )
      )

      const context = results.map(({ context }, i) => [chain.any[i], context])

      const satisfied = results.some(isSatisfied)

      const satisfiedAt = results
        .filter(isSatisfied)
        .map(({ satisfiedAt }) => satisfiedAt)
        .filter(Boolean)
        .sort((a, b) => a.getTime() - b.getTime())[0]

      const satisfiable = results.some(isSatisfiable)

      const satisfiableAt = !satisfiable
        ? undefined
        : results
            .filter(isSatisfiable)
            .map(({ satisfiableAt }) => satisfiableAt)
            .filter(Boolean)
            .sort((a, b) => a.getTime() - b.getTime())[0]

      return {
        context,
        satisfied,
        satisfiable,
        satisfiedAt,
        satisfiableAt:
          satisfiableAt && satisfiedAt
            ? max([satisfiableAt, satisfiedAt])
            : satisfiableAt,
      }
    }

    if ('all' in chain) {
      const results = chain.all.map((item) => this.executeChain(item, input))

      this.partials.push(
        ...results.map(
          (result, i) => [chain.all[i], result, input] as Partial<I>
        )
      )

      const context = results.map(({ context }, i) => [chain.all[i], context])

      const satisfied = results.every(isSatisfied)

      const satisfiedAt = results
        .filter(isSatisfied)
        .map(({ satisfiedAt }) => satisfiedAt)
        .filter(Boolean)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()[0]

      const satisfiable =
        results.every(either(isSatisfied, isSatisfiable)) &&
        results.some(isSatisfiable)

      const satisfiableAt = !satisfiable
        ? undefined
        : results
            .filter(isSatisfiable)
            .map(({ satisfiableAt }) => satisfiableAt)
            .filter(Boolean)
            .sort((a, b) => a.getTime() - b.getTime())
            .reverse()[0]

      return {
        context,
        satisfied,
        satisfiedAt: satisfied ? satisfiedAt : undefined,
        satisfiable,
        satisfiableAt:
          satisfiableAt && satisfiedAt
            ? max([satisfiableAt, satisfiedAt])
            : satisfiableAt,
      }
    }
  }

  private executeChain(chain: RequisiteChain<I>, input: I): RequisiteResult {
    const result =
      'any' in chain || 'all' in chain
        ? this.executeGroup(chain, input)
        : typeof chain.executor === 'function'
        ? chain.executor(input)
        : // lazy executor, for engine extending possible
          chain.executor[0](...chain.executor[1])(input)

    if (chain.debug) {
      typeof chain.debug === 'function'
        ? chain.debug({ chain, result, input })
        : // eslint-disable-next-line no-console
          console.log({ chain, result, input })
    }

    return result
  }

  public execute(input: I) {
    const result = this.executeChain(this.chain, input)

    // save root partials.
    this.partials.push([this.chain, result, input])

    return result
  }

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
  public find(...refs: string[]) {
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
}

/**
 * Shortcut Engine creation/executor.
 */
const evaluate = <I extends {}>(input, chain: RequisiteChain<I>) =>
  new Engine(chain).execute(input)

/**
 * Typing helper for generating a lazy executor tuple.
 */

const lazy = <F extends (...args: unknown[]) => RequisiteExecutor<unknown>>(
  fn: F,
  ...args: Parameters<F>
) => [fn, args] as [F, Parameters<F>]

export { Engine, evaluate, lazy }
