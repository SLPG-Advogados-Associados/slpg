import React from 'react'
import { format } from 'date-fns'
import { AsideTitle } from '~design'
import { Calculator } from '~modules/retirenment'
import { Box, Icons, styled, t, css, classnames } from '~design'

const { Engine } = Calculator

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

const period = ({ from, to }: Calculator.RequisiteResult) => {
  if (!from && !to) return null
  if (from && !to) return `de ${d(from)} em diante`
  if (to && !from) return `até ${d(to)}`
  return `de ${d(from)} até ${d(to)}`
}

const Result: React.FC<{
  result: Calculator.RequisiteResult[]
  root?: boolean
}> = ({ result, root }) => (
  <ResultDate>
    {result.length ? (
      <ul>
        {result.map(({ from, to }) => (
          <li key={`${from}-${to}`}>
            <pre>{period({ from, to })}</pre>
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
  status: 'satisfied' | 'unsatisfied' | 'satisfiable'
}> = ({ status, className = '' }) =>
  status === 'satisfiable' ? (
    <Icons.Alert className={`text-warning ${className}`} />
  ) : status === 'satisfied' ? (
    <Icons.Check className={`text-success ${className}`} />
  ) : (
    <Icons.X className={`text-failure ${className}`} />
  )

const getStatus = (
  { promulgation: from, due: to }: Calculator.Rule,
  chain: Calculator.RequisiteChain<Calculator.CalculatorInput>
) =>
  Engine.isSatisfied(chain, { from, to })
    ? 'satisfied'
    : Engine.isSatisfiable(chain)
    ? 'satisfiable'
    : 'unsatisfied'

const ChainResult: React.FC<{
  depth: number
  rule: Calculator.Rule
  chain: Calculator.RequisiteChain<Calculator.CalculatorInput>
  deadEnd?: boolean
}> = ({ rule, chain, depth, deadEnd: parentDeadEnd }) => {
  const { title, description, lastResult } = chain
  const children = Engine.getChildren(chain)
  const status = getStatus(rule, chain)
  const deadEnd = (parentDeadEnd && depth > 0) || status === 'unsatisfied'

  const name = title ?? description

  return (
    <>
      {name ? (
        <tr className={deadEnd ? 'opacity-50' : ''}>
          <Name depth={depth}>
            {depth ? `└─` : null}
            <span>{name}</span>
            {title && description ? (
              <span className="pl-2 text-silent">{description}</span>
            ) : null}
          </Name>

          <td className="pl-4 relative">
            <Result result={lastResult} />
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
          chain={child}
          depth={name ? depth + 1 : depth}
          deadEnd={deadEnd}
        />
      ))}
    </>
  )
}

const Possibility: React.FC<{
  className?: string
  rule: Calculator.Rule
  possibility: Calculator.Possibility
  result: Calculator.RequisiteResult[]
}> = ({ className, rule, possibility, result }) => {
  const status = getStatus(rule, possibility.requisites.chain)

  return (
    <StyledBox
      as="li"
      success={status === 'satisfied'}
      className={classnames('relative', className)}
    >
      <AsideTitle>{possibility.title}</AsideTitle>

      <div className="absolute top-0 right-0 mt-3 mr-2 flex items-center">
        <Result result={result} root />
        <Icon status={status} className="ml-2 text-800" />
      </div>

      <table className="w-full">
        <thead className="text-200">
          <tr>
            <th>Condição:</th>
            <th className="pl-4">Data de alcance:</th>
          </tr>
        </thead>

        <TBody className="text-100">
          <ChainResult
            rule={rule}
            chain={possibility.requisites.chain}
            depth={0}
          />
        </TBody>
      </table>
    </StyledBox>
  )
}

export { Possibility }
