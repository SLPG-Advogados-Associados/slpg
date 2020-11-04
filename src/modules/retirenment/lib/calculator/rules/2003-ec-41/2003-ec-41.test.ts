/* cspell: disable */
import { test } from '../../lib/test-utils'
import { rule } from './2003-ec-41.rule'

const { promulgation, due } = rule
const [art40integral, art40proportional, art2, art6] = rule.possibilities

describe('retirement/calculator/rules/2003-ec-41', () => {
  describe('Art. 40º', () => {
    /**
     * (...)
     * III - voluntariamente, desde que cumprido tempo mínimo de dez anos de
     * efetivo exercício no serviço público e cinco anos no cargo efetivo em que se
     * dará a aposentadoria, observadas as seguintes condições:
     *
     * a) sessenta anos de idade e trinta e cinco de contribuição, se homem, e
     * cinqüenta e cinco anos de idade e trinta de contribuição, se mulher;
     *
     * (...)
     *
     * § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
     * cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
     * comprove exclusivamente tempo de efetivo exercício das funções de
     * magistério na educação infantil e no ensino fundamental e médio.
     * (...)
     */
    describe('Integral', () => {
      // prettier-ignore
      test.possibility(rule, art40integral, [
        // reached before promulgation:
        ['homem | nascido em 30 | servidor desde 50', [`${promulgation}^${due}`]], //   60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidor desde 50', [`${promulgation}^${due}`]], //  55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅

        // homem

        // by contrib:
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 95', [`2007-12-24^${due}`]], //   60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 2010', []], //                    60 anos ✅, contribuindo 33 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 59 | servidor desde 50', [`2019-01-01^${due}`]], //                              60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 60 | servidor desde 50', []], //                                                 59 anos ❌, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2005', [`2009-12-31^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2015', []], //                        60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 2005', [`2014-12-30^${due}`]], // 60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 2010', []], //                    60 anos ✅, contribuindo 35 ✅, servidor por <10 ❌, >5 anos no último ✅

        // female

        // by contrib:
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 95', [`2007-12-25^${due}`]], //   55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 2010', []], //                    55 anos ✅, contribuindo 28 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 64 | servidora desde 50', [`2019-01-01^${due}`]], //                              55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 65 | servidora desde 50', []], //                                                 54 anos ❌, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2005', [`2009-12-31^${due}`]], //    55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2015', []], //                       55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 2005', [`2014-12-30^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 2010', []], //                    55 anos ✅, contribuindo 30 ✅, servidora por <10 ❌, >5 anos no último ✅

        /**
         * Teacher
         *
         * § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
         * cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
         * comprove exclusivamente tempo de efetivo exercício das funções de
         * magistério na educação infantil e no ensino fundamental e médio.
         */

        // homem

        // by contrib:
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 95', [`2007-12-25^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 2010', []], //                  55 anos ✅, contribuindo 28 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 64 | professor desde 50', [`2019-01-01^${due}`]], //                         55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 65 | professor desde 50', []], //                                            54 anos ❌, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅

        // female

        // by contrib:
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 95', [`2007-12-26^${due}`]], //  50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 2010', []], //                   50 anos ✅, contribuindo 23 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 69 | professora desde 50', [`2019-01-01^${due}`]], //                           50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 70 | professora desde 50', []], //                                              49 anos ❌, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
      ])
    })

    /**
     * (...)
     * III - voluntariamente, desde que cumprido tempo mínimo de dez anos de
     * efetivo exercício no serviço público e cinco anos no cargo efetivo em que se
     * dará a aposentadoria, observadas as seguintes condições:
     *
     * (...)
     *
     * b) sessenta e cinco anos de idade, se homem, e sessenta anos de idade, se
     * mulher, com proventos proporcionais ao tempo de contribuição.
     *
     * § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
     * cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
     * comprove exclusivamente tempo de efetivo exercício das funções de
     * magistério na educação infantil e no ensino fundamental e médio.
     * (...)
     */
    describe('Proporcional', () => {
      // prettier-ignore
      test.possibility(rule, art40proportional, [
        // reached before promulgation:
        ['homem | nascido em 30 | servidor desde 50', [`${promulgation}^${due}`]], //   65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidor desde 50', [`${promulgation}^${due}`]], //  60 anos ✅, servidor por >10 ✅, >5 anos no último ✅

        // homem

        // by age:
        ['homem | nascido em 54 | servidor desde 50', [`2019-01-01^${due}`]], //                              65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 55 | servidor desde 50', []], //                                                 64 anos ❌, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2010', [`2014-12-31^${due}`]], //     65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2015', []], //                        65 anos ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 2005', [`2014-12-30^${due}`]], // 65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 2010', []], //                    65 anos ✅, servidor por <10 ❌, >5 anos no último ✅

        // female

        // by age:
        ['mulher | nascida em 59 | servidora desde 50', [`2019-01-01^${due}`]], //                              60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 60 | servidora desde 50', []], //                                                 59 anos ❌, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2010', [`2014-12-31^${due}`]], //    60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2015', []], //                       60 anos ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 2005', [`2014-12-30^${due}`]], // 60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 2010', []], //                    60 anos ✅, servidora por <10 ❌, >5 anos no último ✅
      ])
    })
  })

  /**
   * (...)
   * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos de idade, se mulher;
   * II - tiver cinco anos de efetivo exercício no cargo em que se dará a aposentadoria;
   * III - contar tempo de contribuição igual, no mínimo, à soma de:
   *
   * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
   * b) um período adicional de contribuição equivalente a vinte por cento do tempo que, na data da publicação desta Emenda, faltaria para atingir o limite de tempo constante da alínea anterior.
   *
   * § 1 º O servidor de que trata este artigo que cumprir as exigências para
   * aposentadoria na forma do caput terá os seus proventos de inatividade
   * reduzidos para cada ano antecipado em relação aos limites de idade
   * estabelecidos pelo art. 40, § 1º, III, a, e § 5º da Constituição Federal, na
   * seguinte proporção:
   *
   * I - três inteiros e cinco décimos por cento, para aquele que completar as
   * exigências para aposentadoria na forma do caput até 31 de dezembro de 2005;
   *
   * II - cinco por cento, para aquele que completar as exigências para
   * aposentadoria na forma do caput a partir de 1º de janeiro de 2006.
   *
   * § 2º Aplica-se ao magistrado e ao membro do Ministério Público e de Tribunal
   * de Contas o disposto neste artigo.
   *
   * § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
   * do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
   * serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
   * 15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
   * observado o disposto no § 1º deste artigo.
   *
   * § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
   * Municípios, incluídas suas autarquias e fundações, que, até a data de
   * publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
   * tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
   * por aposentar-se na forma do disposto no caput, terá o tempo de serviço
   * exercido até a publicação daquela Emenda contado com o acréscimo de
   * dezessete por cento, se homem, e de vinte por cento, se mulher, desde que
   * se aposente, exclusivamente, com tempo de efetivo exercício nas funções de
   * magistério, observado o disposto no § 1º.
   *
   * (...)
   */
  describe('Art. 2º', () => {
    describe('Requisitos', () => {
      const requisites = art2.requisites
      const get = requisites.find.bind(requisites)

      const chains = {
        total: {
          general: {
            male: get('Tempo de contribuição', 'Homem', 'Geral'),
            female: get('Tempo de contribuição', 'Mulher', 'Geral'),
          },
          teacher: {
            male: get('Tempo de contribuição', 'Homem', 'Magistério'),
            // prettier-ignore
            female: get('Tempo de contribuição', 'Mulher', 'Magistério')
          },
        },
      }

      // prettier-ignore
      test.chain('Tempo de contribuição/geral', chains.total.general.male, [
          ['homem | contribuinte desde 50', ['1984-12-23^']],
          ['homem | contribuinte entre 50^60 | contribuinte desde 70', ['1994-12-24^']],

          // Precisely
          ['homem | contribuinte desde 1963-12-25', ['1998-12-16^']],

          // Toll of 20%
          // 5 days missing, 1 extra day
          ['homem | contribuinte desde 1963-12-30', ['1998-12-22^']],
          // 366 days missing, 73.2 extra days
          ['homem | contribuinte desde 1964-12-25', ['2000-02-28^']],
        ])

      // prettier-ignore
      test.chain('Tempo de contribuição/geral', chains.total.general.female, [
          ['mulher | nascida em 49 | contribuinte desde 55', ['1984-12-24^']],
          ['mulher | nascida em 49 | contribuinte entre 55^60 | contribuinte desde 70', ['1994-12-25^']],

          // Precisely
          ['mulher | nascida em 49 | contribuinte desde 1968-12-23', ['1998-12-16^']],

          // Toll of 20%
          // 5 days missing, 1 extra day
          ['mulher | nascida em 49 | contribuinte desde 1968-12-28', ['1998-12-22^']],
          // 366 days missing, 73.4 extra days
          ['mulher | nascida em 49 | contribuinte desde 1969-12-25', ['2000-02-29^']],
        ])

      // prettier-ignore
      test.chain('Tempo de contribuição/professores', chains.total.teacher.male, [
          // NOT A TEACHER
          ['homem | nascido em 49 | contribuinte desde 50', []],

          // 35 years, with 17% extra
          ['homem | nascido em 49 | professor desde 50', ['1979-11-24^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor desde 60', ['1979-11-24^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor entre 60^65 | professor desde 70', ['1984-11-23^']],

          // Precisely
          ['homem | nascido em 49 | professor desde 1969-01-23', ['1998-12-16^']],

          // Toll of 20%
          // 10 * 1,17 days missing, 2 extra day
          ['homem | nascido em 49 | professor desde 1969-02-01', ['1998-12-28^']],
          // 365 * 1,17 days missing, 85.41 extra days
          ['homem | nascido em 49 | professor desde 1970-01-23', ['2000-05-11^']],
        ])

      // prettier-ignore
      test.chain('Tempo de contribuição/professores', chains.total.teacher.female, [
          // NOT A TEACHER
          ['mulher | nascida em 49 | contribuinte desde 50', []],

          // 30 years, with 20% extra
          ['mulher | nascida em 49 | professora desde 55', ['1979-12-26^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora desde 60', ['1979-12-26^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora entre 60^65 | professora desde 70', ['1984-12-25^']],

          // Precisely
          ['mulher | nascida em 49 | professora desde 1973-12-22', ['1998-12-16^']],

          // Toll of 20%
          // 10 * 1,2 days missing, 2 extra day
          ['mulher | nascida em 49 | professora desde 1973-12-30', ['1998-12-28^']],
          // 365 * 1,2 days missing, 85.41 extra days
          ['mulher | nascida em 49 | professora desde 1974-12-22', ['2000-05-25^']],
        ])
    })

    // prettier-ignore
    test.possibility(rule, art2, [        
        // reached before promulgation:
        ['homem | nascido em 45 | servidor desde 50', [`${promulgation}^${due}`]], //   53 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 50 | servidor desde 50', [`${promulgation}^${due}`]], //  48 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // // by contrib:
        ['homem | nascido em 49 | contribuinte entre 57^67 | servidor desde 79', [`2004-12-25^${due}`]], //   54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | contribuinte entre 57^67 | servidor desde 95', []], //                      54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // // by age:
        ['homem | nascido em 51 | contribuinte entre 57^67 | servidor desde 70', [`2004^${due}`]], //         54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 80 | contribuinte entre 57^67 | servidor desde 70', []], //                      52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        ['homem | nascido em 49 | contribuinte entre 57^00 | servidor desde 2015', []], //                    54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌
        ['homem | nascido em 49 | servidor entre 57^05 | servidor desde 2015', [`${promulgation}^2005`]], //  54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅

        // female

        // by contrib:
        ['mulher | nascida em 54 | contribuinte entre 57^62 | servidor desde 79', [`2004-12-26^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | contribuinte entre 57^62 | servidor desde 95', []], //                     49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 56 | contribuinte entre 57^62 | servidor desde 70', [`2004^${due}`]], //        49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 80 | contribuinte entre 57^62 | servidor desde 70', []], //                     47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last
        ['mulher | nascida em 54 | contribuinte entre 57^00 | servidor desde 2015', []], //                   49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌

        /**
         * Teacher
         *
         * § 4º - O professor, servidor da União, dos Estados, do Distrito Federal e
         * dos Municípios, incluídas suas autarquias e fundações, que, até a data da
         * publicação desta Emenda, tenha ingressado, regularmente, em cargo efetivo
         * de magistério e que opte por aposentar-se na forma do disposto no
         * "caput", terá o tempo de serviço exercido até a publicação desta Emenda
         * contado com o acréscimo de dezessete por cento, se homem, e de vinte por
         * cento, se mulher, desde que se aposente, exclusivamente, com tempo de
         * efetivo exercício das funções de magistério.
         */

        // reached before promulgation:
        ['homem | nascido em 40 | professor desde 50', [`${promulgation}^${due}`]], //    58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 40 | professora desde 50', [`${promulgation}^${due}`]], //  58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // by contrib:
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 78', [`2004-06-26^${due}`]], //       54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 90', []], //                          54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods
        // reaches general first:
        ['homem | nascido em 49 | contribuinte entre 60^65 | professor desde 78', [`2009-10-12^${due}`]], //    54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['homem | nascido em 49 | contribuinte entre 60^61 | professor desde 78', [`2011-07-05^${due}`]], //    54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 51 | professor entre 57^67 | professor desde 70', [`2004^${due}`]], //             54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 80 | professor entre 57^67 | professor desde 70', []], //                          52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        ['homem | nascido em 49 | professor entre 57^00 | professor desde 2015', []], //                        54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌
        ['homem | nascido em 49 | professor entre 57^05 | professor desde 2015', [`${promulgation}^2005`]], //  54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 83', [`2004-10-02^${due}`]], //    49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 94', []], //                       49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods (reaches general first)
        // reaches general first:
        ['mulher | nascida em 54 | contribuinte entre 60^65 | professora desde 83', [`2009-10-13^${due}`]], //  49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['mulher | nascida em 54 | contribuinte entre 60^61 | professora desde 83', [`2011-12-16^${due}`]], //  49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 56 | professora entre 60^65 | professora desde 70', [`2004^${due}`]], //          49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 80 | professora entre 60^65 | professora desde 70', []], //                       47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        ['mulher | nascida em 54 | professora entre 57^00 | professora desde 2015', []], //                     49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌
      ])
  })

  /**
   * (...)
   * Art. 6º Ressalvado o direito de opção à aposentadoria pelas normas
   * estabelecidas pelo art. 40 da Constituição Federal ou pelas regras
   * estabelecidas pelo art. 2º desta Emenda, o servidor da União, dos Estados,
   * do Distrito Federal e dos Municípios, incluídas suas autarquias e fundações,
   * que tenha ingressado no serviço público até a data de publicação desta
   * Emenda poderá aposentar-se com proventos integrais, que corresponderão à
   * totalidade da remuneração do servidor no cargo efetivo em que se der a
   * aposentadoria, na forma da lei, quando, observadas as reduções de idade e
   * tempo de contribuição contidas no § 5º do art. 40 da Constituição Federal,
   * vier a preencher, cumulativamente, as seguintes condições:
   *
   *   I - sessenta anos de idade, se homem, e cinqüenta e cinco anos de idade, se
   *   mulher;
   *
   *   II - trinta e cinco anos de contribuição, se homem, e trinta anos de
   *   contribuição, se mulher;
   *
   *   III - vinte anos de efetivo exercício no serviço público; e
   *
   *   IV - dez anos de carreira e cinco anos de efetivo exercício no cargo em que
   *   se der a aposentadoria.
   * (...)
   */
  describe('Art. 6º', () => {
    // prettier-ignore
    test.possibility(rule, art6, [
      // reached before promulgation:
      ['homem | nascido em 30 | servidor desde 50', [`${promulgation}^${due}`]], //   60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >5 anos no último ✅
      ['mulher | nascida em 30 | servidor desde 50', [`${promulgation}^${due}`]], //  55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >5 anos no último ✅

      // homem

      // by contrib:
      ['homem | nascido em 30 | contribuinte entre 50^60 | servidor desde 90', [`2014-12-24^${due}`]], //   60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 30 | contribuinte entre 50^60 | servidor desde 95', []], //                      60 anos ✅, contribuindo 33 ❌, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by age:
      ['homem | nascido em 50 | servidor desde 50', [`2010^${due}`]], //                                    60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 60 | servidor desde 50', []], //                                                 59 anos ❌, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by career:
      ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2001', [`2010-12-30^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by last:
      ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [`2004-12-30^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 30 | servidor entre 50^05 | servidor desde 2015', [`${promulgation}^2005`]], //  60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ <5 anos no último ❌
      // by public service
      ['homem | nascido em 30 | contribuinte entre 50^90 | servidor desde 95', [`2014-12-27^${due}`]], //   55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 2000', []], //                    55 anos ✅, contribuindo 30 ✅, servidora por <20 ❌, >10 anos de carreira ❌ >5 anos no último ✅

      // female

      // by contrib:
      ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 1995', [`2014-12-27^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 2005', []], //                    55 anos ✅, contribuindo 28 ❌, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by age:
      ['mulher | nascida em 60 | servidora desde 50', [`2015^${due}`]], //                                    55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascida em 70 | servidora desde 50', []], //                                                 54 anos ❌, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by career:
      ['mulher | nascido em 30 | servidora entre 50^00 | servidor desde 2000', [`2004-12-30^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascido em 30 | servidora entre 50^00 | servidor desde 2001', [`2010-12-30^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by last:
      ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [`2004-12-30^${due}`]], //    55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by public service
      ['mulher | nascida em 30 | contribuinte entre 50^90 | servidora desde 95', [`2014-12-27^${due}`]], //   55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 2000', []], //                    55 anos ✅, contribuindo 30 ✅, servidora por <20 ❌, >10 anos de carreira ❌ >5 anos no último ✅

      /**
       * Teacher
       *
       * § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
       * cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
       * comprove exclusivamente tempo de efetivo exercício das funções de
       * magistério na educação infantil e no ensino fundamental e médio.
       */

      // homem

      // by contrib:
      ['homem | nascido em 30 | professor entre 50^70 | professor desde 95', [`2004-12-29^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 30 | professor entre 50^70 | professor desde 2015', []], //                  55 anos ✅, contribuindo 28 ❌, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by age:
      ['homem | nascido em 60 | professor desde 50', [`2015^${due}`]], //                               55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['homem | nascido em 70 | professor desde 50', []], //                                            54 anos ❌, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅

      // female

      // by contrib:
      ['mulher | nascida em 35 | professora entre 50^65 | professora desde 95', [`2004-12-29^${due}`]], //  50 anos ✅, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascida em 35 | professora entre 50^65 | professora desde 20015', []], //                  50 anos ✅, contribuindo 23 ❌, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // by age:
      ['mulher | nascida em 65 | professora desde 50', [`2015^${due}`]], //                                 50 anos ✅, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      ['mulher | nascida em 75 | professora desde 50', []], //                                              49 anos ❌, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
    ])
  })
})
