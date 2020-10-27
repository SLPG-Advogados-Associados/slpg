import React, { useMemo } from 'react'
import qs from 'qs'
import { Heading, classnames } from '~design'
import { Calculator, Possibility, InputInfo } from '~modules/retirenment'
import { useRouter } from '~app/lib/router'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

type ParsedInput = {
  sex: string
  birthDate: string
  contributions: {
    start: string
    end?: string
    service: {
      title?: string
      kind: string
      post: string
      career: string
    }
  }[]
}

const parseInput = (raw: string): Calculator.CalculatorInput => {
  if (!raw) return null

  const parsed = (qs.parse(
    decodeURIComponent(raw),
    {}
  ) as unknown) as ParsedInput

  return {
    sex: parsed.sex as Calculator.Sex,
    birthDate: new Date(parsed.birthDate as string),
    contributions: parsed.contributions.map((contribution) => ({
      start: new Date(contribution.start),
      end: contribution.end ? new Date(contribution.end) : undefined,
      salary: 0,
      service: {
        title: contribution.service.title,
        kind: contribution.service.kind as Calculator.ServiceKind,
        post: contribution.service.post as Calculator.Post,
        // post: Calculator.Post['OTHER'],
        career: Number(contribution.service.career),
      },
    })),
  }
}

const CalculatorResultPage = () => {
  const router = useRouter<{ input: string }>()

  const input = useMemo(() => parseInput(router.query.input), [
    router.query.input,
  ])

  const result = useMemo(() => (input ? Calculator.calculate(input) : null), [
    input,
  ])

  if (!result) return 'Not ready'

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
                  rule={rule}
                  result={result}
                  possibility={possibility}
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

export default CalculatorResultPage
