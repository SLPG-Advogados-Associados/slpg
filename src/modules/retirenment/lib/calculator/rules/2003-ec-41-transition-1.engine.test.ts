/* cspell: disable */
import { testChain } from '../lib/test-utils'
import { NEVER } from '../lib/const'
// @ts-ignore
import { rule } from './2003-ec-41-transition-1.engine'

const { promulgation } = rule

describe('retirement/calculator/rules/2003-ec-41-transition-1.engine', () => {
  describe('possibilities', () => {
    const [first] = rule.possibilities

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
     * aposentadoria na forma do caput terá os seus proventos de inatividade
     * reduzidos para cada ano antecipado em relação aos limites de idade
     * estabelecidos pelo art. 40, § 1º, III, a, e § 5º da Constituição Federal, na
     * seguinte proporção:
     *
     * I - três inteiros e cinco décimos por cento, para aquele que completar as
     * exigências para aposentadoria na forma do caput até 31 de dezembro de 2005;
     *
     * II - cinco por cento, para aquele que completar as exigências para
     * aposentadoria na forma do caput a partir de 1º de janeiro de 2006.
     *
     * § 2º Aplica-se ao magistrado e ao membro do Ministério Público e de Tribunal
     * de Contas o disposto neste artigo.
     *
     * § 3º Na aplicação do disposto no § 2º deste artigo, o magistrado ou o membro
     * do Ministério Público ou de Tribunal de Contas, se homem, terá o tempo de
     * serviço exercido até a data de publicação da Emenda Constitucional nº 20, de
     * 15 de dezembro de 1998, contado com acréscimo de dezessete por cento,
     * observado o disposto no § 1º deste artigo.
     *
     * § 4º O professor, servidor da União, dos Estados, do Distrito Federal e dos
     * Municípios, incluídas suas autarquias e fundações, que, até a data de
     * publicação da Emenda Constitucional nº 20, de 15 de dezembro de 1998,
     * tenha ingressado, regularmente, em cargo efetivo de magistério e que opte
     * por aposentar-se na forma do disposto no caput, terá o tempo de serviço
     * exercido até a publicação daquela Emenda contado com o acréscimo de
     * dezessete por cento, se homem, e de vinte por cento, se mulher, desde que
     * se aposente, exclusivamente, com tempo de efetivo exercício nas funções de
     * magistério, observado o disposto no § 1º.
     *
     * (...)
     */
    describe('Ingresso até 16.12.1998', () => {
      describe('Requisitos', () => {
        const get = first.requisites.find.bind(first.requisites)

        const requisites = {
          age: get('Idade'),
          last: get('Tempo no cargo de aposentadoria'),
          total: {
            general: {
              male: get('Tempo total de contribuição', 'Homem', 'Geral'),
              female: get('Tempo total de contribuição', 'Mulher', 'Geral'),
            },
            teacher: {
              male: get('Tempo total de contribuição', 'Homem', 'Professor'),
              // prettier-ignore
              female: get('Tempo total de contribuição', 'Mulher', 'Professora')
            },
          },
        }

        testChain(requisites.age.title, requisites.age, [
          ['homem | nascido em 66', ['2019-01-01']],
          ['homem | nascido em 67', [NEVER]],
          ['mulher | nascida em 71', ['2019-01-01']],
          ['mulher | nascida em 72', [NEVER]],
        ])

        // prettier-ignore
        testChain(requisites.last.title, requisites.last, [
          ['homem | nascido em 40', [NEVER]],
          ['mulher | nascida em 40', [NEVER]],
          ['homem | nascido em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['mulher | nascida em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['homem | nascido em 40 | contribuinte desde 2015', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 2015', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Tempo de contribuição/geral', requisites.total.general.male, [
          ['homem | contribuinte desde 50', ['1984-12-23', '1984-12-23']],
          ['homem | contribuinte entre 50^60 | contribuinte desde 70', ['1994-12-24', '1994-12-24']],

          // Precisely
          ['homem | contribuinte desde 1963-12-25', ['1998-12-16', '1998-12-16']],

          // Toll of 20%
          // 5 days missing, 1 extra day
          ['homem | contribuinte desde 1963-12-30', ['1998-12-22', '1998-12-22']],
          // 366 days missing, 73.2 extra days
          ['homem | contribuinte desde 1964-12-25', ['2000-02-28', '2000-02-28']],
        ])

        // prettier-ignore
        testChain('Tempo de contribuição/geral', requisites.total.general.female, [
          ['mulher | nascida em 49 | contribuinte desde 55', ['1984-12-24', '1984-12-24']],
          ['mulher | nascida em 49 | contribuinte entre 55^60 | contribuinte desde 70', ['1994-12-25', '1994-12-25']],

          // Precisely
          ['mulher | nascida em 49 | contribuinte desde 1968-12-23', ['1998-12-16', '1998-12-16']],

          // Toll of 20%
          // 5 days missing, 1 extra day
          ['mulher | nascida em 49 | contribuinte desde 1968-12-28', ['1998-12-22', '1998-12-22']],
          // 366 days missing, 73.4 extra days
          ['mulher | nascida em 49 | contribuinte desde 1969-12-25', ['2000-02-29', '2000-02-29']],
        ])

        // prettier-ignore
        testChain('Tempo de contribuição/professores', requisites.total.teacher.male, [
          // NOT A TEACHER
          ['homem | nascido em 49 | contribuinte desde 50', [null, NEVER]],

          // 35 years, with 17% extra
          ['homem | nascido em 49 | professor desde 50', ['1979-11-24', '1979-11-24']],
          ['homem | nascido em 49 | professor entre 50^60 | professor desde 60', ['1979-11-24', '1979-11-24']],
          ['homem | nascido em 49 | professor entre 50^60 | professor entre 60^65 | professor desde 70', ['1984-11-23', '1984-11-23']],

          // Precisely
          ['homem | nascido em 49 | professor desde 1969-01-23', ['1998-12-16', '1998-12-16']],

          // Toll of 20%
          // 10 * 1,17 days missing, 2 extra day
          ['homem | nascido em 49 | professor desde 1969-02-01', ['1998-12-28', '1998-12-28']],
          // 365 * 1,17 days missing, 85.41 extra days
          ['homem | nascido em 49 | professor desde 1970-01-23', ['2000-05-11', '2000-05-11']],
        ])

        // prettier-ignore
        testChain('Tempo de contribuição/professores', requisites.total.teacher.female, [
          // NOT A TEACHER
          ['mulher | nascida em 49 | contribuinte desde 50', [null, NEVER]],

          // 30 years, with 20% extra
          ['mulher | nascida em 49 | professora desde 55', ['1979-12-26', '1979-12-26']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora desde 60', ['1979-12-26', '1979-12-26']],
          ['mulher | nascida em 49 | professora entre 55^60 | professora entre 60^65 | professora desde 70', ['1984-12-25', '1984-12-25']],

          // Precisely
          ['mulher | nascida em 49 | professora desde 1973-12-22', ['1998-12-16', '1998-12-16']],

          // Toll of 20%
          // 10 * 1,2 days missing, 2 extra day
          ['mulher | nascida em 49 | professora desde 1973-12-30', ['1998-12-28', '1998-12-28']],
          // 365 * 1,2 days missing, 85.41 extra days
          ['mulher | nascida em 49 | professora desde 1974-12-22', ['2000-05-25', '2000-05-25']],
        ])
      })

      // prettier-ignore
      testChain(null, first.requisites.chain, [        
        // reached before promulgation:
        ['homem | nascido em 45 | contribuinte desde 50', [promulgation, promulgation]], //                             53 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 50 | contribuinte desde 50', [promulgation, promulgation]], //                            48 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // // by contrib:
        ['homem | nascido em 49 | contribuinte entre 57^67 | contribuinte desde 79', ['2004-12-25', '2004-12-25']], //  54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | contribuinte entre 57^67 | contribuinte desde 95', [null, '2024-03-08']], //          54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // // by age:
        ['homem | nascido em 51 | contribuinte entre 57^67 | contribuinte desde 70', ['2004-01-01', '2004-01-01']], //  54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 80 | contribuinte entre 57^67 | contribuinte desde 70', [null, NEVER]], //                 52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 49 | contribuinte entre 57^00 | contribuinte desde 2015', [null, NEVER]], //               54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 79', ['2004-12-26', '2004-12-26']], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | contribuinte entre 57^62 | contribuinte desde 95', [null, '2024-03-09']], //          49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 56 | contribuinte entre 57^62 | contribuinte desde 70', ['2004-01-01', '2004-01-01']], //  49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 80 | contribuinte entre 57^62 | contribuinte desde 70', [null, NEVER]], //                 47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 54 | contribuinte entre 57^00 | contribuinte desde 2015', [null, NEVER]], //               49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌

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
        ['homem | nascido em 40 | professor desde 50', [promulgation, promulgation]], //                            58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 40 | professora desde 50', [promulgation, promulgation]], //                          58 anos ✅, contribuindo 48 ✅, mais de 5 anos no último ✅

        // male

        // by contrib:
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 78', ['2004-06-26', '2004-06-26']], //    54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 49 | professor entre 60^65 | professor desde 90', [null, '2021-05-01']], //            54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods
        // reaches general first:
        ['homem | nascido em 49 | contribuinte entre 60^65 | professor desde 78', ['2009-10-12', '2009-10-12']], // 54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['homem | nascido em 49 | contribuinte entre 60^61 | professor desde 78', ['2011-07-05', '2011-07-05']], // 54 anos ✅, contribuindo 34 ❌, mais de 5 anos no último ✅
        // by age:
        ['homem | nascido em 51 | professor entre 57^67 | professor desde 70', ['2004-01-01', '2004-01-01']], //    54 anos ✅, contribuindo 36 ✅, mais de 5 anos no último ✅
        ['homem | nascido em 80 | professor entre 57^67 | professor desde 70', [null, NEVER]], //                   52 anos ❌, contribuindo 36 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 49 | professor entre 57^00 | professor desde 2015', [null, NEVER]], //                 54 anos ✅, contribuindo 36 ✅, menos de 5 anos no último ❌

        // female

        // by contrib:
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 83', ['2004-10-02', '2004-10-02']], // 49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 54 | professora entre 60^65 | professora desde 94', [null, '2020-08-05']], //         49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // combined teacher/non-teacher periods (reaches general first)
        // reaches general first:
        ['mulher | nascida em 54 | contribuinte entre 60^65 | professora desde 83', ['2009-10-13', '2009-10-13']], // 49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // reaches teacher first:
        ['mulher | nascida em 54 | contribuinte entre 60^61 | professora desde 83', ['2011-12-16', '2011-12-16']], // 49 anos ✅, contribuindo 29 ❌, mais de 5 anos no último ✅
        // by age:
        ['mulher | nascida em 56 | professora entre 60^65 | professora desde 70', ['2004-01-01', '2004-01-01']], // 49 anos ✅, contribuindo 31 ✅, mais de 5 anos no último ✅
        ['mulher | nascida em 80 | professora entre 60^65 | professora desde 70', [null, NEVER]], //                47 anos ❌, contribuindo 31 ✅, mais de 5 anos no último ✅
        // by last:
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 54 | professora entre 57^00 | professora desde 2015', [null, NEVER]], //              49 anos ✅, contribuindo 31 ✅, menos de 5 anos no último ❌
      ])
    })
  })
})
