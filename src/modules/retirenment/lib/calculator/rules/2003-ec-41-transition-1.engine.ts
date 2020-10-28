/* cspell: disable */
import * as reachers from '../lib/reachers'
import { Engine } from '../lib/engine'
import { Rule } from '../lib/rule'
import { isTeacher, isPublic } from '../lib/predicates'
import { Possibility, Sex, CalculatorInput } from '../types'
import { dates } from './dates'

const { MALE, FEMALE } = Sex

const { sex, contribution, age, after, before } = reachers
const { processors, last, total, career } = contribution
const { filter, bonus, toll } = processors

const promulgation = dates.ec41
const due = dates.ec103

type Input = CalculatorInput

const possibilities: Possibility[] = [
  {
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
    requisites: new Engine<Input>({
      all: [
        { executor: after(promulgation) },
        { executor: before(due) },

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
  },

  {
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
    requisites: new Engine<Input>({
      all: [
        { executor: after(promulgation) },
        { executor: before(due) },

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
  },
]

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 41 - Regra de Transição',
  description: 'Regras de transição como descritas na EC nº 41, de 2003',
  possibilities,
})

export { rule }
