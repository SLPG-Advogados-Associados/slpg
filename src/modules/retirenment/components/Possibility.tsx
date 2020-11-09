import React, { useMemo } from 'react'
import { format } from 'date-fns'
import { AsideTitle } from '~design'
import { Calculator } from '~modules/retirenment'
import { Box, Icons, styled, t, css } from '~design'

type ResultStatus = 'satisfied' | 'unsatisfied' | 'satisfiable'

const d = (date: Date) => format(date, 'dd/MM/yyyy')

const Name = styled.th<{ depth: number }>`
  ${({ depth }) => (depth ? `padding-left: ${depth - 1}em` : null)}
`

const TBody = styled.tbody`
  tr:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }
`

const variants = t.variants({
  success: css`
    border-color: ${t.theme('colors.success')};
  `,
})

const StyledBox = styled(Box)<{ success: boolean }>`
  ${variants}
`

const ResultDate = styled.div`
  font-size: 0.85em;
  opacity: 0.75;
`

const period = ({ from, to }: Calculator.Period) => {
  if (!from && !to) return null
  if (from && !to) return `de ${d(from)} em diante`
  if (to && !from) return `até ${d(to)}`
  return `de ${d(from)} até ${d(to)}`
}

const Result: React.FC<{
  result: Calculator.Period[]
  status: ResultStatus
  root?: boolean
}> = ({ result, root, status }) => (
  <ResultDate>
    {result.length && status !== 'unsatisfied' ? (
      <ul>
        {result.slice(0, root ? 1 : result.length).map(({ from, to }) => (
          <li key={`${from}-${to}`}>
            <pre>{root ? d(from) : period({ from, to })}</pre>
          </li>
        ))}
      </ul>
    ) : (
      <pre>{root ? 'Não alcançado' : 'Inalcansável'}</pre>
    )}
  </ResultDate>
)

const Icon: React.FC<{
  className?: string
  status: ResultStatus
}> = ({ status, className = '' }) =>
  status === 'satisfiable' ? (
    <Icons.Alert className={`text-warning ${className}`} />
  ) : status === 'satisfied' ? (
    <Icons.Check className={`text-success ${className}`} />
  ) : (
    <Icons.X className={`text-failure ${className}`} />
  )

const getStatus = (
  rule: Calculator.Rule,
  possibility: Calculator.Possibility,
  chain?: Calculator.RequisiteChain<Calculator.CalculatorInput>
) =>
  rule.isSatisfied(possibility, chain)
    ? 'satisfied'
    : rule.isSatisfiable(possibility, chain)
    ? 'satisfiable'
    : 'unsatisfied'

const ChainResult: React.FC<{
  depth: number
  rootStatus: 'satisfied' | 'satisfiable' | 'unsatisfied'
  rule: Calculator.Rule
  possibility: Calculator.Possibility
  chain: Calculator.RequisiteChain<Calculator.CalculatorInput>
  deadEnd?: boolean
}> = ({
  rule,
  possibility,
  chain,
  depth,
  rootStatus,
  deadEnd: parentDeadEnd,
}) => {
  const { title, description } = chain
  const [_refs, lastResult] = possibility.requisites.getLastPartial(chain)
  const children = Calculator.Requisites.getChildren(chain)
  const status = getStatus(rule, possibility, chain)
  const deadEnd = (parentDeadEnd && depth > 0) || status === 'unsatisfied'
  const irrelevant =
    deadEnd && (rootStatus === 'satisfied' || rootStatus === 'satisfiable')

  const name = title ?? description

  return (
    <>
      {name ? (
        <tr className={irrelevant ? 'opacity-50' : ''}>
          <Name depth={depth}>
            {depth ? `└─` : null}
            <span>{name}</span>
            {title && description ? (
              <span className="pl-2 text-silent">{description}</span>
            ) : null}
          </Name>

          <td className="pl-4 relative">
            <Result result={lastResult} status={status} />
            <div className="absolute top-0 right-0 mt-1">
              <Icon status={status} />
            </div>
          </td>
        </tr>
      ) : null}

      {children.map((child, i) => (
        <ChainResult
          key={i}
          rule={rule}
          possibility={possibility}
          chain={child}
          depth={name ? depth + 1 : depth}
          deadEnd={deadEnd}
          rootStatus={rootStatus}
        />
      ))}
    </>
  )
}

const Possibility: React.FC<{
  rule: Calculator.Rule
  possibility: Calculator.Possibility
  input: Calculator.CalculatorInput
}> = ({ rule, possibility, input }) => {
  const result = useMemo(() => rule.execute(possibility, input), [
    rule,
    possibility,
    input,
  ])

  const status = getStatus(rule, possibility)

  return (
    <StyledBox success={status === 'satisfied'} className={'relative'}>
      <AsideTitle>{possibility.title}</AsideTitle>

      <div className="absolute top-0 right-0 mt-3 mr-2 flex items-center">
        <Result result={result} status={status} root />
        <Icon status={status} className="ml-2 text-800" />
      </div>

      <table
        className={`w-full ${status === 'unsatisfied' ? 'opacity-50' : ''}`}
      >
        <thead className="text-200">
          <tr>
            <th>Condição:</th>
            <th className="pl-4">Data de alcance:</th>
          </tr>
        </thead>

        <TBody className="text-100">
          <ChainResult
            rule={rule}
            possibility={possibility}
            chain={possibility.requisites.chain}
            rootStatus={status}
            depth={0}
          />
        </TBody>
      </table>
    </StyledBox>
  )
}

export { Possibility }
