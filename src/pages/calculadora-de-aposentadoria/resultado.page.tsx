import React, { useMemo } from 'react'
import qs from 'qs'
import { hot } from 'react-hot-loader/root'
import { useRouter } from '~app/lib/router'
import { Heading } from '~design'
import { Calculator } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

// sample raw: `contributions%255B0%255D%255Bservice%255D%255Btitle%255D%253DPrimeiro%2526contributions%255B0%255D%255Bservice%255D%255Bkind%255D%253DPUBLIC%2526contributions%255B0%255D%255Bservice%255D%255Bpost%255D%253DTEACHER%2526contributions%255B0%255D%255Bend%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526contributions%255B0%255D%255Bstart%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526contributions%255B1%255D%255Bservice%255D%255Btitle%255D%253DSegudo%2526contributions%255B1%255D%255Bservice%255D%255Bkind%255D%253DPRIVATE%2526contributions%255B1%255D%255Bservice%255D%255Bpost%255D%253DTEACHER%2526contributions%255B1%255D%255Bend%255D%253D%2526contributions%255B1%255D%255Bstart%255D%253D1989-12-31T23%25253A00%25253A00.000Z%2526birthDate%253D1989-12-31T23%25253A00%25253A00.000Z%2526gender%253DMALE`

const parseInput = (raw: string): Calculator.Input => {
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

  return (
    <Page meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Calculadora de Aposentadoria</Heading>
      </div>

      <main>
        <Section title="Dados pessoais" className="bg-aside" textual>
          <pre>{JSON.stringify(input, null, 2)}</pre>
        </Section>
      </main>
    </Page>
  )
}

export default hot(CalculatorResultPage)
