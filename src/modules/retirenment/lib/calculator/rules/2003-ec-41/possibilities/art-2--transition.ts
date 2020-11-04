import { Sex, CalculatorInput } from '../../../types'
import * as reachers from '../../../lib/reachers'
import { Requisites, Possibility } from '../../../lib/engine'
import { isTeacher, isPublic } from '../../../lib/predicates'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total, lastIsPublic } = contribution
const { filter, bonus, toll } = processors

type Input = CalculatorInput

const possibility = new Possibility({
  title: 'Art. 2º',
  description: `
    (...)
    I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;
    II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;
    III - contar tempo de contribuição igual, no mínimo, à soma de:

      a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
      b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

    § 1 º O servidor de que trata este artigo que cumprir as exigências para
    aposentadoria na forma do caput terá os seus proventos de inatividade
    reduzidos para cada ano antecipado em relação aos limites de idade
    estabelecidos pelo art. 40, § 1º, III, a, e § 5º da Constituição Federal, na
    seguinte proporção:

      I - três inteiros e cinco décimos por cento, para aquele que completar as
      exigências para aposentadoria na forma do caput até 31 de dezembro de 2005;

      II - cinco por cento, para aquele que completar as exigências para
      aposentadoria na forma do caput a partir de 1º de janeiro de 2006.

    (...)

    § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
    do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
    serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
    15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
    observado o disposto no § 1º deste artigo.
          
    § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
    Municípios, incluídas suas autarquias e fundações, que, até a data de
    publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
    tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
    por aposentar-se na forma do disposto no caput, terá o tempo de serviço
    exercido até a publicação daquela Emenda contado com o acréscimo de
    dezessete por cento, se homem, e de vinte por cento, se mulher, desde que
    se aposente, exclusivamente, com tempo de efetivo exercício nas funções de
    magistério, observado o disposto no § 1º.

    (...)
  `,
  requisites: new Requisites<Input>({
    all: [
      { title: 'Serviço público', executor: lastIsPublic() },

      {
        title: 'Idade',
        any: [
          {
            title: 'Homem',
            description: '53 anos',
            all: [
              { executor: sex(MALE) },
              { executor: age({ expected: { years: 53 } }) },
            ],
          },

          {
            title: 'Mulher',
            description: '48 anos',
            all: [
              { executor: sex(FEMALE) },
              { executor: age({ expected: { years: 48 } }) },
            ],
          },
        ],
      },

      {
        title: 'Tempo no cargo de aposentadoria',
        details: `II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;`,
        executor: last({ expected: { years: 5 }, filter: isPublic }),
      },

      {
        title: 'Tempo de contribuição',
        details: `
          III - contar tempo de contribuição igual, no mínimo, à soma de:

            a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
            b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.

            (...)

            § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
            do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
            serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
            15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
            observado o disposto no § 1º deste artigo.

            § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
            Municípios, incluídas suas autarquias e fundações, que, até a data de
            publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
            tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
            por aposentar-se na forma do disposto no caput, terá o tempo de serviço
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
                    title: 'Geral',
                    executor: total({
                      expected: { years: 35 },
                      processors: {
                        '1998-12-16^': toll(0.2),
                      },
                    }),
                  },

                  {
                    title: 'Magistério',
                    executor: total({
                      expected: { years: 35 },
                      processors: {
                        '^': filter(isTeacher),
                        '^1998-12-16': bonus(1.17),
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
              { executor: sex(FEMALE) },
              {
                any: [
                  {
                    title: 'Geral',
                    executor: total({
                      expected: { years: 30 },
                      processors: {
                        '1998-12-16^': toll(0.2),
                      },
                    }),
                  },

                  {
                    title: 'Magistério',
                    executor: total({
                      expected: { years: 30 },
                      processors: {
                        '^': filter(isTeacher),
                        '^1998-12-16': bonus(1.2),
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
})

export { possibility }
