import React from 'react'
import qs from 'qs'
import { format as _format } from 'date-fns'
import { useRouter } from '~app/lib/router'
import { Heading } from '~design'
import { Calculator, InputInfo } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { Box } from '~design'

const samples = [
  {
    description: '',
    input: {
      gender: 'MALE',
      birthDate: '1940-01-01T00:00:00.000Z',
      contributions: [
        {
          start: '1960-01-01T00:00:00.000Z',
          salary: 1000,
          service: { kind: 'PUBLIC', post: 'OTHER' },
        },
      ],
    },
  },

  {
    description: '',
    input: {
      gender: 'MALE',
      birthDate: '1940-01-01T00:00:00.000Z',
      contributions: [
        {
          start: '1965-01-01T00:00:00.000Z',
          salary: 1000,
          service: { kind: 'PUBLIC', post: 'OTHER' },
        },
      ],
    },
  },
]

const parse = ({
  description,
  input,
}): { description: string; input: Calculator.CalculatorInput } => {
  input.birthDate = new Date(input.birthDate)
  input.contributions = input.contributions || []

  for (const contribution of input.contributions) {
    contribution.start = new Date(contribution.start)
    contribution.end = contribution.end ? new Date(contribution.end) : undefined
  }

  return { description, input }
}

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

const CalculatorSamplePage = () => {
  const router = useRouter<{ input: string }>()

  const select = input =>
    router.push({
      pathname: '/calculadora-de-aposentadoria/resultado',
      query: {
        input: encodeURIComponent(
          qs.stringify(input, { encodeValuesOnly: true })
        ),
      },
    })

  return (
    <Page meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>
          Calculadora de Aposentadoria
          <br />
          <strong>Exemplos</strong>
        </Heading>
      </div>

      <main>
        <Section className="bg-aside">
          <ul className="flex -mx-4 flex-wrap justify-center">
            {samples.map(parse).map(({ input }, index) => (
              <Box
                as="li"
                key={index}
                className="mx-4 mb-8"
                onClick={() => select(input)}
              >
                <InputInfo input={input} />
              </Box>
            ))}
          </ul>
        </Section>
      </main>
    </Page>
  )
}

export default CalculatorSamplePage
