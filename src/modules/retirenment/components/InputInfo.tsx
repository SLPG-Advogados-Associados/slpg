import React from 'react'
import { format as _format } from 'date-fns'
import { styled } from '~design'
import { CalculatorInput, Contribution } from '../lib/calculator'

const format = (value?: Date | null) =>
  value ? _format(value, 'dd/MM/yyyy') : null

const DefinitionList = styled.dl`
  dt,
  dd {
    display: inline;
  }

  dt {
    font-weight: bold;
    margin-right: 1em;
  }

  dd::after {
    content: '';
    display: block;
  }

  table {
    text-align: left;

    td {
      padding-right: 1em;
    }
  }
`

type Careers = {
  [key: number]: Contribution[]
}

const InputInfo: React.FC<{ input: CalculatorInput }> = ({ input }) => {
  const careers: Careers = {}

  for (const contribution of input.contributions) {
    const { career } = contribution.service
    careers[career] = careers[career] ?? []
    careers[career].push(contribution)
  }

  return (
    <DefinitionList>
      <dt>Sexo:</dt>
      <dd>{input.sex}</dd>

      <dt>Data de nascimento:</dt>
      <dd>{format(input.birthDate)}</dd>

      <dt>Contribuições:</dt>
      <dd>
        <table>
          <thead className="text-200">
            <tr>
              <th>Carreira</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Cargo</th>
            </tr>
          </thead>

          <tbody className="text-100">
            {Object.values(careers).map((contributions, career) =>
              contributions.map(({ start, end, service }, index) => (
                <tr key={`${career}-${index}`}>
                  <td>{career + 1}</td>
                  <td>{format(start)}</td>
                  <td>{format(end) || 'atual'}</td>
                  <td>
                    {service.kind}, {service.post}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </dd>
    </DefinitionList>
  )
}

export { InputInfo }
