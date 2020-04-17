import React, { useMemo } from 'react'
import qs from 'qs'
import { hot } from 'react-hot-loader/root'
import { Heading, classnames } from '~design'
import { Calculator, Possibility, InputInfo } from '~modules/retirenment'
import { useRouter } from '~app/lib/router'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}
const parseInput = (raw: string): Calculator.CalculatorInput => {
  if (!raw) return null

  const parsed = qs.parse(decodeURIComponent(raw), {})

  parsed.birthDate = new Date(parsed.birthDate)
  parsed.contributions = parsed.contributions || []

  for (const contribution of parsed.contributions) {
    contribution.start = new Date(contribution.start)
    contribution.end = contribution.end ? new Date(contribution.end) : undefined
  }

  return parsed
}

const CalculatorResultPage = () => {
  const router = useRouter<{ input: string }>()

  const input = useMemo(() => parseInput(router.query.input), [
    router.query.input,
  ])

  // @todo: check inf input is ok

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
        <Section title="Resumo dos Dados" className="bg-aside">
          <InputInfo input={input} />
        </Section>

        {result.map(([rule, possibilities], index) => (
          <Section
            key={rule.title}
            title={rule.title}
            className={classnames('pb-20', { 'bg-aside': index % 2 })}
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
