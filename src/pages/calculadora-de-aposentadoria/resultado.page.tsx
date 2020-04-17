import React, { useMemo } from 'react'
import qs from 'qs'
import { isValid, format } from 'date-fns'
import { hot } from 'react-hot-loader/root'
import { useRouter } from '~app/lib/router'
import { Heading, AsideTitle } from '~design'
import { Calculator } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { Icons, styled, t, css } from '~design'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

// sample raw: `contributions%255B0%255D%255Bservice%255D%255Btitle%255D%253DPrimeiro%2526contributions%255B0%255D%255Bservice%255D%255Bkind%255D%253DPUBLIC%2526contributions%255B0%255D%255Bservice%255D%255Bpost%255D%253DTEACHER%2526contributions%255B0%255D%255Bend%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526contributions%255B0%255D%255Bstart%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526contributions%255B1%255D%255Bservice%255D%255Btitle%255D%253DSegudo%2526contributions%255B1%255D%255Bservice%255D%255Bkind%255D%253DPRIVATE%2526contributions%255B1%255D%255Bservice%255D%255Bpost%255D%253DTEACHER%2526contributions%255B1%255D%255Bend%255D%253D%2526contributions%255B1%255D%255Bstart%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526birthDate%253D1989-12-31T23%25253A00%25253A00.000Z%2526gender%253DMALE`

const parseInput = (raw: string): Calculator.CalculatorInput => {
  if (!raw) return null

  const parsed = qs.parse(decodeURIComponent(raw), {})

  parsed.birthDate = new Date(parsed.birthDate)
  parsed.contributions = parsed.contributions || []

  for (const contribution of parsed.contributions) {
    contribution.start = new Date(contribution.start)
    contribution.end = contribution.end ? new Date(contribution.end) : null
  }

  return parsed
}

const Box = styled.div`
  padding: 1rem;
  border: 1px solid ${t.theme('colors.divisor')};
  border-radius: 0.2rem;
  background-color: ${t.theme('colors.white')};
`

const variants = t.variants({
  success: css`
    border-color: ${t.theme('colors.success')};
  `,
})

const StyledBox = styled(Box)<{ success: boolean }>`
  ${variants}
`

const Possibility: React.FC<{
  possibility: Calculator.Possibility
  result: Calculator.PossibilityExecution
}> = ({ possibility, result: [passed, context] }) => {
  return (
    <StyledBox as="li" className="mx-2 w-1/2 relative" success={passed}>
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
}

const CalculatorResultPage = () => {
  const router = useRouter<{ input: string }>()

  const input = useMemo(() => parseInput(router.query.input), [
    router.query.input,
  ])

  // const input: Calculator.CalculatorInput = {
  //   gender: Calculator.Gender.MALE,
  //   birthDate: new Date('1940'),
  //   contributions: [
  //     {
  //       start: new Date('1960'),
  //       salary: 10,
  //       service: {
  //         kind: Calculator.ServiceKind.PUBLIC,
  //         post: Calculator.Post.OTHER,
  //       },
  //     },
  //   ],
  // }

  // check inf input is ok

  const result = useMemo(() => Calculator.calculate(input), [
    router.query.input,
  ])

  return (
    <Page meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>
          Calculadora de Aposentadoria
          <br />
          <strong>Resultados</strong>
        </Heading>
      </div>

      <main>
        {result.map(([rule, possibilities], index) => (
          <Section
            key={rule.title}
            title={rule.title}
            className={index % 2 ? 'bg-aside' : ''}
            textual
          >
            <p>{rule.description}</p>

            <ul className="flex -mx-2">
              {possibilities.map(([possibility, result]) => (
                <Possibility
                  key={possibility.title}
                  possibility={possibility}
                  result={result}
                />
              ))}
            </ul>
          </Section>
        ))}
      </main>
    </Page>
  )
}

export default hot(CalculatorResultPage)
