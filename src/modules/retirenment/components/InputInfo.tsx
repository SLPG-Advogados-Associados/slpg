import React from 'react'
import { format as _format } from 'date-fns'
import { styled } from '~design'
import { CalculatorInput } from '../lib/calculator'

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

const InputInfo: React.FC<{ input: CalculatorInput }> = ({ input }) => (
  <DefinitionList>
    <dt>Sexo:</dt>
    <dd>{input.gender}</dd>

    <dt>Data de nascimento:</dt>
    <dd>{format(input.birthDate)}</dd>

    <dt>Contribuições:</dt>
    <dd>
      <table>
        <thead className="text-200">
          <tr>
            <th>Início</th>
            <th>Fim</th>
            <th>Cargo</th>
          </tr>
        </thead>

        <tbody className="text-100">
          {input.contributions.map((contribution, index) => (
            <tr key={index}>
              <td>{format(contribution.start)}</td>
              <td>{format(contribution.end) || 'atual'}</td>
              <td>
                {contribution.service.kind}, {contribution.service.post}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </dd>
  </DefinitionList>
)

export { InputInfo }
