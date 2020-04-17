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

const Possibility: React.FC<{
  className?: string
  possibility: Calculator.Possibility
  result: Calculator.PossibilityExecution
}> = ({ className, possibility, result: [passed, context] }) => (
  <StyledBox
    as="li"
    success={passed}
    className={classnames('relative', className)}
  >
    <AsideTitle>{possibility.title}</AsideTitle>

    <div className="absolute top-0 right-0 mt-3 mr-2 flex items-center">
      {isValid(context.reached) ? (
        <strong>{format(context.reached, 'dd/MM/yyyy')}</strong>
      ) : (
        'Inalcançável'
      )}

      {passed ? (
        <Icons.Check className="ml-2 text-success text-1000" />
      ) : (
        <Icons.X className="ml-2 text-failure text-1000" />
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
        {context.result.conditions.map(([condition, [reached]]) => (
          <tr key={condition.description}>
            <th>{condition.description}</th>
            <td className="pl-4 relative">
              {isValid(reached)
                ? format(reached, 'dd/MM/yyyy')
                : 'Inalcançável'}

              <div className="absolute top-0 right-0 mt-1">
                {isValid(reached) ? (
                  <Icons.Check className="text-success" />
                ) : (
                  <Icons.X className="text-failure" />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </StyledBox>
)

export { Possibility }
