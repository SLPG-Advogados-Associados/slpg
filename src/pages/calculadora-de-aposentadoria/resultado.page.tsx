import React, { useMemo } from 'react'
import qs from 'qs'
import { hot } from 'react-hot-loader/root'
import { useRouter } from '~app/lib/router'
import { Heading } from '~design'
import { Calculator, Possibility } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'

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
                  className="mx-2 w-1/2"
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
