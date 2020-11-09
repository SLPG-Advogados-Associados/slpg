import React from 'react'
import { Heading, classnames } from '~design'
import { Calculator, Possibility, InputInfo } from '~modules/retirenment'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'

import { useInput } from './lib/useInput'

const meta = {
  title: 'Calculadora de Aposentadoria',
  description: 'Estude aqui suas possibilidades de aposentadoria',
}

const CalculatorResultPage = () => {
  const input = useInput()

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

        {Calculator.rules.map((rule, index) => (
          <Section
            key={rule.title}
            title={rule.title}
            className={classnames('pb-20', { 'bg-aside': index % 2 })}
            textual
          >
            <p>{rule.description}</p>

            <ul className="flex flex-wrap -mx-2">
              {rule.possibilities.map((possibility) => (
                <li key={possibility.title} className="px-2 w-1/2 mb-12">
                  <Possibility
                    rule={rule}
                    possibility={possibility}
                    input={input}
                  />
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </main>
    </Page>
  )
}

export default CalculatorResultPage
