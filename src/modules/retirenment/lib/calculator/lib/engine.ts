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

type Meta = { title?: string; description?: string }

export type RequisiteExecutor<I extends {}, C = {}> = (
  input: I
) => RequisiteResult<C>

export type Requisite<I> = Meta & { executor: RequisiteExecutor<I> }
export type RequisiteGroupAny<I> = Meta & { any: RequisiteChain<I>[] }
export type RequisiteGroupAll<I> = Meta & { all: RequisiteChain<I>[] }

export type RequisiteGroup<I> = RequisiteGroupAny<I> | RequisiteGroupAll<I>
export type RequisiteChain<I> = RequisiteGroup<I> | Requisite<I>

type Partial<I extends {}> = [RequisiteChain<I>, RequisiteResult, I]

const isSatisfied = ({ satisfied }: RequisiteResult) => satisfied
const isSatisfiable = ({ satisfiable }: RequisiteResult) => satisfiable

class Engine<I extends {}> {
  public chain: RequisiteChain<I>

  public partials: Partial<I>[] = []

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

      const satisfiable = results.every(either(isSatisfied, isSatisfiable))

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
    return 'any' in chain || 'all' in chain
      ? this.executeGroup(chain, input)
      : chain.executor(input)
  }

  public execute(input: I) {
    const result = this.executeChain(this.chain, input)

    // save root partials.
    this.partials.push([this.chain, result, input])

    return result
  }

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
}

export { Engine }
