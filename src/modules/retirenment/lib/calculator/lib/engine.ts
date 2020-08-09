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

class Engine<I extends {}> {
  public chain: RequisiteChain<I>

  public partials: Partial<I>[] = []

  constructor(chain: RequisiteChain<I>) {
    this.chain = chain
  }

  private executeGroup(chain: RequisiteGroup<I>, input: I) {
    if ('any' in chain) {
      const results = chain.any.map((item) => this.executeChain(item, input))

      const satisfiedAt = results
        .map(({ satisfiedAt }) => satisfiedAt)
        .filter(Boolean)
        .sort((a, b) => a.getTime() - b.getTime())[0]

      this.partials.push(
        ...results.map(
          (result, i) => [chain.any[i], result, input] as Partial<I>
        )
      )

      return {
        context: results.map(({ context }, i) => [chain.any[i], context]),
        satisfied: results.some(({ satisfied }) => satisfied),
        satisfiable: results.some(({ satisfiable }) => satisfiable),
        satisfiedAt,
      }
    }

    if ('all' in chain) {
      const results = chain.all.map((item) => this.executeChain(item, input))

      const satisfiedAt = results
        .map(({ satisfiedAt }) => satisfiedAt)
        .filter(Boolean)
        .sort((a, b) => a.getTime() - b.getTime())
        .reverse()[0]

      this.partials.push(
        ...results.map(
          (result, i) => [chain.all[i], result, input] as Partial<I>
        )
      )

      return {
        context: results.map(({ context }, i) => [chain.all[i], context]),
        satisfied: results.every(({ satisfied }) => satisfied),
        satisfiable: results.every(({ satisfiable }) => satisfiable),
        satisfiedAt,
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
}

export { Engine }
