import React from 'react'
import { isValid, format } from 'date-fns'
import { AsideTitle } from '~design'
import { Calculator } from '~modules/retirenment'
import { Box, Icons, styled, t, css, classnames } from '~design'

const variants = t.variants({
  success: css`
    border-color: ${t.theme('colors.success')};
  `,
})

const StyledBox = styled(Box)<{ success: boolean }>`
  ${variants}
`

const ConditionResult: React.FC<{
  rule: Calculator.Rule
  condition: Calculator.Condition
  result: Calculator.ReacherResult
}> = ({ rule, condition, result: [reached] }) => {
  const valid = isValid(reached)
  const formatted = valid ? format(reached, 'dd/MM/yyyy') : null
  const after = valid && rule.due < reached

  return (
    <tr key={condition.description}>
      <th>{condition.description}</th>
      <td className="pl-4 relative">
        {valid ? formatted : 'Inalcançável'}

        <div className="absolute top-0 right-0 mt-1">
          {valid && after ? (
            <Icons.Alert className="text-warning" />
          ) : valid ? (
            <Icons.Check className="text-success" />
          ) : (
            <Icons.X className="text-failure" />
          )}
        </div>
      </td>
    </tr>
  )
}

const Possibility: React.FC<{
  className?: string
  rule: Calculator.Rule
  possibility: Calculator.Possibility
  result: Calculator.PossibilityExecution
}> = ({ className, rule, possibility, result: [passed, context] }) => {
  const valid = isValid(context.reached)
  const formatted = valid ? format(context.reached, 'dd/MM/yyyy') : null
  const after = valid && rule.due < context.reached

  return (
    <StyledBox
      as="li"
      success={passed}
      className={classnames('relative', className)}
    >
      <AsideTitle>{possibility.title}</AsideTitle>

      <div className="absolute top-0 right-0 mt-3 mr-2 flex items-center">
        {valid ? <strong>{formatted}</strong> : 'Inalcançável'}

        {valid && after ? (
          <Icons.Alert className="text-warning ml-2 text-800" />
        ) : valid ? (
          <Icons.Check className="text-success ml-2 text-800" />
        ) : (
          <Icons.X className="text-failure ml-2 text-800" />
        )}
      </div>

      <table>
        <thead className="text-200">
          <tr>
            <th>Condição:</th>
            <th className="pl-4">Data de alcance:</th>
          </tr>
        </thead>

        <tbody className="text-100">
          {context.result.conditions.map(([condition, result]) => (
            <ConditionResult
              key={condition.description}
              rule={rule}
              result={result}
              condition={condition}
            />
          ))}
        </tbody>
      </table>
    </StyledBox>
  )
}

export { Possibility }
