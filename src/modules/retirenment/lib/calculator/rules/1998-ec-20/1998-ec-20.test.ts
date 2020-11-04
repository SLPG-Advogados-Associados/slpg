import { test } from '../../lib/test-utils'
import { rule } from './1998-ec-20.rule'

const {
  promulgation,
  due,
  possibilities: [
    art40integral,
    art40proportional,
    art8integral,
    art8proportional,
  ],
} = rule

describe('retirement/calculator/rules/1998-ec-20', () => {
  describe('Art. 8 (transição)', () => {
    /**
     * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito
     * anosde idade, se mulher;
     * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
     * aposentadoria;
     * III - contar tempo de contribuição igual, no mínimo, à soma de:
     *
     * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
     * b) um período adicional de contribuição equivalente a vinte por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior.
     *
     * (...)
     *
     * § 3º - Na aplicação do disposto no parágrafo anterior, o magistrado ou o
     * membro do Ministério Público ou de Tribunal de Contas, se homem, terá o
     * tempo de serviço exercido até a publicação desta Emenda contado com o
     * acréscimo de dezessete por cento.
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
    describe('Integral', () => {
      describe('Requisitos', () => {
        const get = art8integral.requisites.find.bind(art8integral.requisites)

        const requisites = {
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
        test.chain('Tempo de contribuição/geral', requisites.total.general.male, [
          ['homem | nascido em 49 | contribuinte desde 50', ['1984-12-23^']],
          ['homem | nascido em 49 | contribuinte entre 50^60 | contribuinte desde 70', ['1994-12-24^']],

          // Precisely
          ['homem | nascido em 49 | contribuinte desde 1963-12-25', ['1998-12-16^']],

          // Toll of 20%
          // 5 days missing, 1 extra day
          ['homem | nascido em 49 | contribuinte desde 1963-12-30', ['1998-12-22^']],
          // 366 days missing, 73.2 extra days
          ['homem | nascido em 49 | contribuinte desde 1964-12-25', ['2000-02-28^']],
        ])

        // prettier-ignore
        test.chain('Tempo de contribuição/geral', requisites.total.general.female, [
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
        test.chain('Tempo de contribuição/professores', requisites.total.teacher.male, [
          // NOT A TEACHER
          ['homem | nascido em 49 | contribuinte desde 50', []],

          // 35 years, with 17% extra
          ['homem | nascido em 49 | professor desde 50', ['1979-11-24^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor desde 60', ['1979-11-24^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor entre 60^65 | professor desde 70', ['1984-11-23^']],

          // Toll of 17%
          // 10 * 1,17 days missing, 2 extra day
          ['homem | nascido em 49 | professor desde 1969-02-01', ['1998-12-28^']],
          // 365 * 1,17 days missing, 85.41 extra days
          ['homem | nascido em 49 | professor desde 1970-01-23', ['2000-05-11^']],
        ])

        // prettier-ignore
        test.chain('Tempo de contribuição/professores', requisites.total.teacher.female, [
          // NOT A TEACHER
          ['mulher | nascida em 49 | contribuinte desde 50', []],

          // 30 years, with 20% extra
          ['mulher | nascida em 49 | professora desde 55', ['1979-12-26^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora desde 60', ['1979-12-26^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora entre 60^65 | professora desde 70', ['1984-12-25^']],

          // Toll of 20%
          // 10 * 1,2 days missing, 2 extra day
          ['mulher | nascida em 49 | professora desde 1973-12-30', ['1998-12-28^']],
          // 365 * 1,2 days missing, 85.41 extra days
          ['mulher | nascida em 49 | professora desde 1974-12-22', ['2000-05-25^']],
        ])
      })

      // prettier-ignore
      test.possibility(rule, art8integral, [
        // reached before promulgation:
        ['homem | nascido em 45 | contribuinte desde 50', [`${promulgation}^${due}`]], //   53 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 50 | contribuinte desde 50', [`${promulgation}^${due}`]], //  48 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // by contrib:
        ['homem | nascido em 49 | contribuinte entre 57^67 | contribuinte desde 78', [`2003-10-14^${due}`]], // 54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | contribuinte entre 57^67 | contribuinte desde 80', []], //                    54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 49 | contribuinte entre 57^67 | contribuinte desde 70', [`2002-01-01^${due}`]], // 54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 51 | contribuinte entre 57^67 | contribuinte desde 70', []], //                    52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 49 | contribuinte entre 57^00 | contribuinte desde 2000', []], //                  54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 78', [`2003-10-15^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 80', []], //                     49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 70', [`2002-01-01^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 56 | contribuinte entre 57^62 | contribuinte desde 70', []], //                     47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 54 | contribuinte entre 57^00 | contribuinte desde 2000', []], //                   49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌
        
        /**
         * Teacher
         */

        // reached before promulgation:
        ['homem | nascido em 40 | professor desde 50', [`${promulgation}^${due}`]], //    58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 40 | professora desde 50', [`${promulgation}^${due}`]], //  58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // by contrib:
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 77', [`2003-01-30^${due}`]], //   54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 78', []], //                      54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods
        // reaches general first:
        ['homem | nascido em 49 | contribuinte entre 60^65 | professor desde 78', []], //                   54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['homem | nascido em 49 | contribuinte entre 60^61 | professor desde 78', []], //                   54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 49 | professor entre 57^67 | professor desde 70', [`2002-01-01^${due}`]], //   54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 51 | professor entre 57^67 | professor desde 70', []], //                      52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 49 | professor entre 57^00 | professor desde 2000', []], //                    54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 82', [`2003-04-25^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 83', []], //                     49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods (reaches general first)
        // reaches general first:
        ['mulher | nascida em 54 | contribuinte entre 60^65 | professora desde 83', []], //                   49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['mulher | nascida em 54 | contribuinte entre 60^61 | professora desde 83', []], //                   49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 70', [`2002-01-01^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 56 | professora entre 60^65 | professora desde 70', []], //                     47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 54 | professora entre 57^00 | professora desde 2000', []], //                   49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌
      ])
    })

    /**
     * § 1º - O servidor de que trata este artigo, desde que atendido o disposto
     * em seus incisos I e II, e observado o disposto no art. 4º desta Emenda,
     * pode aposentar-se com proventos proporcionais ao tempo de contribuição,
     * quando atendidas as seguintes condições;
     *
     * I - contar tempo de contribuição igual, no mínimo, à soma de:
     *
     * a) trinta anos, se homem, e vinte e cinco anos, se mulher; e
     *
     * b) um período adicional de contribuição equivalente a quarenta por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior;
     */
    describe('Proporcional', () => {
      describe('Requisitos', () => {
        const get = art8proportional.requisites.find.bind(
          art8proportional.requisites
        )

        const requisites = {
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
        test.chain('Tempo de contribuição/geral', requisites.total.general.male, [
          ['homem | nascido em 49 | contribuinte desde 50', ['1979-12-25^']],
          ['homem | nascido em 49 | contribuinte entre 50^60 | contribuinte desde 70', ['1989-12-25^']],

          // Precisely
          ['homem | nascido em 49 | contribuinte desde 1968-12-23', ['1998-12-16^']],

          // Toll of 40%
          // 10 days missing, 4 extra days
          ['homem | nascido em 49 | contribuinte desde 1969-01-02', ['1998-12-30^']],
          // 365 days missing, 146 extra days
          ['homem | nascido em 49 | contribuinte desde 1969-12-23', ['2000-05-10^']],
        ])

        // prettier-ignore
        test.chain('Tempo de contribuição/geral', requisites.total.general.female, [
          ['mulher | nascida em 49 | contribuinte desde 55', ['1979-12-26^']],
          ['mulher | nascida em 49 | contribuinte entre 55^60 | contribuinte desde 70', ['1989-12-26^']],

          // Precisely
          ['mulher | nascida em 49 | contribuinte desde 1973-12-22', ['1998-12-16^']],

          // Toll of 40%
          // 10 days missing, 4 extra day
          ['mulher | nascida em 49 | contribuinte desde 1974-01-01', ['1998-12-30^']],
          // 365 days missing, 146 extra days
          ['mulher | nascida em 49 | contribuinte desde 1974-12-22', ['2000-05-10^']],
        ])

        // prettier-ignore
        test.chain('Tempo de contribuição/professores', requisites.total.teacher.male, [
          // NOT A TEACHER
          ['homem | nascido em 49 | contribuinte desde 50', []],

          // 30 years, with 17% extra
          ['homem | nascido em 49 | professor desde 50', ['1975-08-17^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor desde 60', ['1975-08-17^']],
          ['homem | nascido em 49 | professor entre 50^60 | professor entre 60^65 | professor desde 70', ['1980-08-16^']],

          // Precisely
          ['homem | nascido em 49 | professor desde 1973-05-02', ['1998-12-16^']],

          // Toll of 40%
          // 11 * 1,17 days missing, 5 extra day
          ['homem | nascido em 49 | professor desde 1973-05-13', ['1999-01-03^']],
          // 365 * 1,17 days missing, 146 extra days
          ['homem | nascido em 49 | professor desde 1974-05-02', ['2000-08-05^']],
        ])

        // prettier-ignore
        test.chain('Tempo de contribuição/professores', requisites.total.teacher.female, [
          // NOT A TEACHER
          ['mulher | nascida em 49 | contribuinte desde 50', []],

          // 30 years, with 20% extra
          ['mulher | nascida em 49 | professora desde 55', ['1975-10-27^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora desde 60', ['1975-10-27^']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora entre 60^65 | professora desde 70', ['1980-10-26^']],

          // Precisely
          ['mulher | nascida em 49 | professora desde 1978-02-20', ['1998-12-16^']],

          // Toll of 40%
          // 13 * 1,2 days missing, 6 extra day
          ['mulher | nascida em 49 | professora desde 1978-03-05', ['1999-01-07^']],
          // 365 * 1,2 days missing, 146 extra days
          ['mulher | nascida em 49 | professora desde 1979-02-20', ['2000-08-20^']],
        ])
      })

      // prettier-ignore
      test.possibility(rule, art8proportional, [
        // reached before promulgation:
        ['homem | nascido em 45 | contribuinte desde 50', [`${promulgation}^${due}`]], //  53 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 50 | contribuinte desde 50', [`${promulgation}^${due}`]], // 48 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // by contrib:
        ['homem | nascido em 50 | contribuinte entre 57^62 | contribuinte desde 77', [`2003-03-12^${due}`]], // 53 anos ✅, contribuindo 30 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 50 | contribuinte entre 57^62 | contribuinte desde 78', []], //                    53 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 50 | contribuinte desde 70', [`2003-01-01^${due}`]], //                            53 anos ✅, contribuindo 30 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 51 | contribuinte desde 70', []], //                                               52 anos ❌, contribuindo 30 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 50 | contribuinte entre 57^00 | contribuinte desde 2000', []], //                  54 anos ✅, contribuindo 30 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 82', [`2003-03-13^${due}`]], //  48 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 83', []], //                     48 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 54 | contribuinte desde 76', [`2002-01-01^${due}`]], //                             48 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 56 | contribuinte desde 76', []], //                                                47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 54 | contribuinte entre 76^00 | contribuinte desde 2000', []], //                   48 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌

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
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 81', [`2003-04-29^${due}`]], // 54 anos ✅, contribuindo 30 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 82', []], //                    54 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods (reaches general first)
        // reaches general first:
        ['homem | nascido em 49 | contribuinte entre 60^65 | professor desde 81', []], //                 54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['homem | nascido em 49 | contribuinte entre 60^61 | professor desde 81', []], //                 54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 49 | professor entre 57^67 | professor desde 70', [`2002-01-01^${due}`]], // 54 anos ✅, contribuindo 30 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 51 | professor entre 57^67 | professor desde 70', []], //                    52 anos ❌, contribuindo 30 ✅, mais de 5 anos no último ✅
        // by last:
        ['homem | nascido em 49 | professor entre 57^00 | professor desde 2000', []], //                  54 anos ✅, contribuindo 30 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 86', [`2003-10-07^${due}`]], //  49 anos ✅, contribuindo 25 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 87', []], //                     49 anos ✅, contribuindo 24 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods (reaches general first)
        // reaches general first:
        ['mulher | nascida em 54 | contribuinte entre 60^65 | professora desde 83', []], //                   49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['mulher | nascida em 54 | contribuinte entre 60^61 | professora desde 83', []], //                   49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 70', [`2002-01-01^${due}`]], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 56 | professora entre 60^65 | professora desde 70', []], //                     47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        ['mulher | nascida em 54 | professora entre 57^00 | professora desde 2000', []], //                   49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌
      ])
    })
  })

  describe('Art. 40º (permanente)', () => {
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
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 90', [`2002-12-24^${due}`]], //   60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 92', []], //                      60 anos ✅, contribuindo 33 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 43 | servidor desde 50', [`2003-01-01^${due}`]], //                              60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 44 | servidor desde 50', []], //                                                 59 anos ❌, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^90 | servidor desde 1995', [`1999-12-31^${due}`]], //     60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // using not last recorded service
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [`${promulgation}^2000`]], //  60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1990', [`1999-12-30^${due}`]], // 60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1995', []], //                    60 anos ✅, contribuindo 35 ✅, servidor por <10 ❌, >5 anos no último ✅
  
        // female
  
        // by contrib:
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 90', [`2002-12-25^${due}`]], //   55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 92', []], //                      55 anos ✅, contribuindo 28 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 48 | servidora desde 50', [`2003-01-01^${due}`]], //                              55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 49 | servidora desde 50', []], //                                                 54 anos ❌, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^90 | servidora desde 1995', [`1999-12-31^${due}`]], //    55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [`${promulgation}^2000`]], // 55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1990', [`1999-12-30^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1995', []], //                    55 anos ✅, contribuindo 30 ✅, servidora por <10 ❌, >5 anos no último ✅
  
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
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 90', [`2002-12-25^${due}`]], // 55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 92', []], //                    55 anos ✅, contribuindo 28 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 48 | professor desde 50', [`2003-01-01^${due}`]], //                         55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 49 | professor desde 50', []], //                                            54 anos ❌, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
  
        // female
  
        // by contrib:
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 90', [`2002-12-26^${due}`]], //  50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 92', []], //                     50 anos ✅, contribuindo 23 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 53 | professora desde 50', [`2003-01-01^${due}`]], //                           50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 54 | professora desde 50', []], //                                              49 anos ❌, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
  
        /**
         * Customn
         */
        // has multiple resolution periods
        ['homem | nascido em 30 | servidor entre 50^1998-12-20 | servidor desde 1998-12-25', [`${promulgation}^1998-12-20`, `2003-12-24^${due}`]]
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
        ['homem | nascido em 38 | servidor desde 50', [`2003-01-01^${due}`]], //                              65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 39 | servidor desde 50', []], //                                                 64 anos ❌, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^90 | servidor desde 1995', [`1999-12-31^${due}`]], //     65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [`${promulgation}^2000`]], //  65 anos ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1990', [`1999-12-30^${due}`]], // 65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1995', []], //                    65 anos ✅, servidor por <10 ❌, >5 anos no último ✅

        // female

        // by age:
        ['mulher | nascida em 43 | servidora desde 50', [`2003-01-01^${due}`]], //                              60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 44 | servidora desde 50', []], //                                                 59 anos ❌, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^90 | servidora desde 1995', [`1999-12-31^${due}`]], //    60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [`${promulgation}^2000`]], // 60 anos ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1990', [`1999-12-30^${due}`]], // 60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1995', []], //                    60 anos ✅, servidora por <10 ❌, >5 anos no último ✅
      ])
    })
  })
})
