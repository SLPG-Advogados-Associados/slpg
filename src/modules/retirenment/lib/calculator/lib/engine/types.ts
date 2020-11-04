type Base = {
  title?: string
  description?: string
  details?: string
  debug?: ((...args: unknown[]) => void) | boolean
  satisfiable?: (result: Period[], constraint: Period) => boolean
}

export type Period = { from?: Date; to?: Date }
export type RequisiteExecutor<I extends {}> = (input: I) => Period[]

export type Requisite<I> = Base & { executor: RequisiteExecutor<I> }
export type RequisiteGroupAny<I> = Base & { any: RequisiteChain<I>[] }
export type RequisiteGroupAll<I> = Base & { all: RequisiteChain<I>[] }

export type RequisiteGroup<I> = RequisiteGroupAny<I> | RequisiteGroupAll<I>
export type RequisiteChain<I> = RequisiteGroup<I> | Requisite<I>

export type Partial<I extends {}> = [RequisiteChain<I>, Period[], I]

export type Reference<I extends {}> = [
  string[][],
  Array<string | number>,
  RequisiteChain<I>
]
