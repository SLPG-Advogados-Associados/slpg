/* cspell: disable */
import { isEqual } from '../lib/date'
import * as reachers from '../lib/reachers'
import { multiply, subtract } from '../lib/duration'
import {
  Rule,
  Possibility,
  Sex,
  Post,
  CalculatorInput,
  Contribution,
} from '../types'
import { Engine } from '../lib/engine'
import { dates } from './dates'

const { MALE, FEMALE } = Sex
const { TEACHER } = Post

const { sex, contribution, age, after } = reachers
const { processors, last, total } = contribution

const promulgation = dates.ec41
const due = dates.ec103

const isTeacher = ({ service: { post } }: Contribution) => post === TEACHER

/**
 * Processor factory for deducting a toll after prommulgation.
 */
const toll = (
  perc: number
): reachers.Processor<{ computed: { processed: Duration } }> => {
  // use "input" as ref for memoized context
  const deducted = []

  return (duration, { expected, contribution, computed }) => {
    if (
      // ensure we only deduct toll once.
      !deducted.includes(computed) &&
      isEqual(contribution.start, dates.ec20)
    ) {
      // use "input" as ref for memoized context
      deducted.push(computed)

      const missing = subtract(expected, computed.processed)
      const toll = multiply(perc, missing)

      return subtract(duration, toll)
    }

    return duration
  }
}

type Input = CalculatorInput

const possibilities: Possibility[] = [
  {
    title: 'Ingresso até 16.12.1998',
    description: `
      (...)
      I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;
      II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;
      III - contar tempo de contribuição igual, no mínimo, à soma de:

        a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
        b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

      § 1 º O servidor de que trata este artigo que cumprir as exigências para
      aposentadoria na forma do caput terá os seus proventos de inatividade
      reduzidos para cada ano antecipado em relação aos limites de idade
      estabelecidos pelo art. 40, § 1º, III, a, e § 5º da Constituição Federal, na
      seguinte proporção:

        I - três inteiros e cinco décimos por cento, para aquele que completar as
        exigências para aposentadoria na forma do caput até 31 de dezembro de 2005;

        II - cinco por cento, para aquele que completar as exigências para
        aposentadoria na forma do caput a partir de 1º de janeiro de 2006.

      § 2º Aplica-se ao magistrado e ao membro do Ministério Público e de Tribunal
      de Contas o disposto neste artigo.

      § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
      do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
      serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
      15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
      observado o disposto no § 1º deste artigo.
            
      § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
      Municípios, incluídas suas autarquias e fundações, que, até a data de
      publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
      tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
      por aposentar-se na forma do disposto no caput, terá o tempo de serviço
      exercido até a publicação daquela Emenda contado com o acréscimo de
      dezessete por cento, se homem, e de vinte por cento, se mulher, desde que
      se aposente, exclusivamente, com tempo de efetivo exercício nas funções de
      magistério, observado o disposto no § 1º.

      (...)
    `,
    requisites: new Engine<Input>({
      all: [
        { executor: after(promulgation) },

        {
          title: 'Idade',
          description: `I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;`,
          any: [
            {
              all: [
                {
                  description: 'Homem',
                  executor: sex(MALE),
                },
                {
                  description: '53 anos de idade',
                  executor: age({ due, expected: { years: 53 } }),
                },
              ],
            },

            {
              all: [
                {
                  description: 'Mulher',
                  executor: sex(FEMALE),
                },
                {
                  description: '48 anos de idade',
                  executor: age({ due, expected: { years: 48 } }),
                },
              ],
            },
          ],
        },

        {
          title: 'Tempo no cargo de aposentadoria',
          description: `II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;`,
          executor: last({ expected: { years: 5 }, due }),
        },

        {
          title: 'Tempo total de contribuição',
          description: `
            III - contar tempo de contribuição igual, no mínimo, à soma de:

              a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
              b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

              (...)

              § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
              do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
              serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
              15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
              observado o disposto no § 1º deste artigo.

              § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
              Municípios, incluídas suas autarquias e fundações, que, até a data de
              publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
              tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
              por aposentar-se na forma do disposto no caput, terá o tempo de serviço
              exercido até a publicação daquela Emenda contado com o acréscimo de
              dezessete por cento, se homem, e de vinte por cento, se mulher, desde que
              se aposente, exclusivamente, com tempo de efetivo exercício nas funções de
              magistério, observado o disposto no § 1º.
            `,
          any: [
            {
              title: 'Homem',
              description: '35 anos de serviço',
              all: [
                { executor: sex(MALE) },
                {
                  any: [
                    {
                      // debug: (args) =>
                      //   console.log(JSON.stringify(args, null, 2)),
                      title: 'Geral',
                      executor: total({
                        due,
                        expected: { years: 35 },
                        processors: {
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },

                    // {
                    //   title: 'Magistrado',
                    //   executor: ...
                    // },

                    {
                      title: 'Professor',
                      executor: total({
                        due,
                        expected: { years: 35 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.17),
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },
                  ],
                },
              ],
            },

            {
              title: 'Mulher',
              description: '30 anos de serviço',
              all: [
                {
                  executor: sex(FEMALE),
                },
                {
                  any: [
                    {
                      title: 'Geral',
                      executor: total({
                        due,
                        expected: { years: 30 },
                        processors: {
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },

                    // {
                    //   title: 'Magistrado',
                    //   executor: ...
                    // },

                    {
                      title: 'Professora',
                      executor: total({
                        due,
                        expected: { years: 30 },
                        processors: {
                          '^': processors.filter(isTeacher),
                          '^1998-12-16': processors.bonus(1.2),
                          '1998-12-16^': toll(0.2),
                        },
                      }),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
]

const rule: Rule = {
  promulgation: promulgation,
  due,
  title: 'EC nº 41 - Regra de Transição',
  description: 'Regras de transição como descritas na EC nº 41, de 2003',
  possibilities,
}

export { rule }
