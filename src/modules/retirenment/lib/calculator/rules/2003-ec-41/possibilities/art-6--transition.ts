import * as reachers from '../../../lib/reachers'
import { Sex, CalculatorInput } from '../../../types'
import { isTeacher, isPublic } from '../../../lib/predicates'
import { Requisites, Possibility } from '../../../lib/engine'

const { MALE, FEMALE } = Sex
const { sex, contribution, age } = reachers
const { processors, last, total, career } = contribution
const { filter } = processors

type Input = CalculatorInput

const possibility = new Possibility({
  title: 'Art. 6º',
  description: `
    (...)
    Art. 6º Ressalvado o direito de opção à aposentadoria pelas normas
    estabelecidas pelo art. 40 da Constituição Federal ou pelas regras
    estabelecidas pelo art. 2º desta Emenda, o servidor da União, dos Estados,
    do Distrito Federal e dos Municípios, incluídas suas autarquias e fundações,
    que tenha ingressado no serviço público até a data de publicação desta
    Emenda poderá aposentar-se com proventos integrais, que corresponderão à
    totalidade da remuneração do servidor no cargo efetivo em que se der a
    aposentadoria, na forma da lei, quando, observadas as reduções de idade e
    tempo de contribuição contidas no § 5º do art. 40 da Constituição Federal,
    vier a preencher, cumulativamente, as seguintes condições:

      I - sessenta anos de idade, se homem, e cinqüenta e cinco anos de idade, se
      mulher;
      
      II - trinta e cinco anos de contribuição, se homem, e trinta anos de
      contribuição, se mulher;
      
      III - vinte anos de efetivo exercício no serviço público; e
      
      IV - dez anos de carreira e cinco anos de efetivo exercício no cargo em que
      se der a aposentadoria.
    (...)
  `,
  requisites: new Requisites<Input>({
    all: [
      {
        title: 'Tempo de serviço público',
        details: `III - vinte anos de efetivo exercício no serviço público;`,
        executor: total({
          expected: { years: 20 },
          processors: {
            '^': filter(isPublic),
          },
        }),
      },

      {
        title: 'Tempo de carreira',
        details: `IV - dez anos de carreira (...)`,
        executor: career({ expected: { years: 10 } }),
      },

      {
        title: 'Tempo no cargo de aposentadoria',
        details: `IV - (...) cinco anos de efetivo exercício no cargo em que se der a aposentadoria.`,
        executor: last({ expected: { years: 5 } }),
      },

      {
        title: 'Idade e tempo de contribuição',
        any: [
          {
            title: 'Homem',
            all: [
              { executor: sex(MALE) },

              {
                any: [
                  {
                    title: 'Geral',
                    all: [
                      {
                        description: '60 anos de idade',
                        executor: age({
                          expected: { years: 60 },
                        }),
                      },

                      {
                        description: '35 anos de contribuição',
                        executor: total({
                          expected: { years: 35 },
                        }),
                      },
                    ],
                  },

                  {
                    title: 'Magistério',
                    all: [
                      {
                        description: '55 anos de idade',
                        executor: age({
                          expected: { years: 55 },
                        }),
                      },

                      {
                        description: '30 anos de contribuição',
                        executor: total({
                          expected: { years: 30 },
                          processors: {
                            '^': filter(isTeacher),
                          },
                        }),
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            title: 'Mulher',
            all: [
              { executor: sex(FEMALE) },

              {
                any: [
                  {
                    title: 'Geral',
                    all: [
                      {
                        description: '55 anos de idade',
                        executor: age({
                          expected: { years: 55 },
                        }),
                      },

                      {
                        description: '30 anos de contribuição',
                        executor: total({
                          expected: { years: 30 },
                        }),
                      },
                    ],
                  },

                  {
                    title: 'Magistério',
                    all: [
                      {
                        description: '50 anos de idade',
                        executor: age({
                          expected: { years: 50 },
                        }),
                      },

                      {
                        description: '25 anos de contribuição',
                        executor: total({
                          expected: { years: 25 },
                          processors: {
                            '^': filter(isTeacher),
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
      },
    ],
  }),
})

export { possibility }
