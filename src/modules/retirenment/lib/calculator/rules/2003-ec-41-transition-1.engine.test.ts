/* cspell: disable */
import { testChain } from '../lib/test-utils'
import { NEVER } from '../lib/const'
// @ts-ignore
import { rule } from './2003-ec-41-transition-1.engine'

const { promulgation } = rule

describe('retirement/calculator/rules/2003-ec-41-transition-1.engine', () => {
  describe('possibilities', () => {
    const [first, second] = rule.possibilities

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

    describe('Art. 6º', () => {
      describe('Requisitos', () => {
        const get = second.requisites.find.bind(second.requisites)

        const requisites = {
          public: get('Tempo de serviço público'),
          last: get('Tempo no cargo de aposentadoria'),
          career: get('Tempo de carreira'),
          total: {
            general: {
              male: get('Idade e tempo de contribuição', 'Homem', 'Geral'),
              female: get('Idade e tempo de contribuição', 'Mulher', 'Geral'),
            },
            teacher: {
              male: get('Idade e tempo de contribuição', 'Homem', 'Professor'),
              // prettier-ignore
              female: get('Idade e tempo de contribuição', 'Mulher', 'Professora')
            },
          },
        }

        // prettier-ignore
        testChain(requisites.public.title, requisites.public, [
          ['homem | nascido em 40', [null]],
          ['mulher | nascida em 40', [null]],
          ['homem | nascido em 40 | contribuinte desde 50', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 50', [null, NEVER]],
          ['homem | nascido em 40 | servidor desde 50', ['1969-12-27', '1969-12-27']],
          ['mulher | nascida em 40 | servidora desde 50', ['1969-12-27', '1969-12-27']],
          ['homem | nascido em 40 | servidor desde 2000', [null, '2019-12-27']],
          ['mulher | nascida em 40 | servidora desde 2000', [null, '2019-12-27']],
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
        testChain(requisites.career.title, requisites.career, [
          ['homem | nascido em 40', [NEVER]],
          ['mulher | nascida em 40', [NEVER]],
          ['homem | nascido em 40 | contribuinte entre 50^55', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte entre 50^55', [null, NEVER]],
          ['homem | nascido em 40 | servidor desde 2005', ['2014-12-30', '2014-12-30']],
          ['mulher | nascida em 40 | servidora desde 2005', ['2014-12-30', '2014-12-30']],
          ['homem | nascido em 40 | servidor desde 2010', [null, NEVER]],
          ['mulher | nascida em 40 | servidora desde 2010', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/geral', requisites.total.general.male, [
          ['homem | nascido em 20 | contribuinte desde 50', ['1984-12-23', '1984-12-23']],
          ['homem | nascido em 20 | contribuinte entre 50^60 | contribuinte desde 70', ['1994-12-24', '1994-12-24']],
          ['homem | nascido em 20 | contribuinte desde 1963-12-25', ['1998-12-16', '1998-12-16']],
          ['homem | nascido em 20 | contribuinte desde 90', [null, '2024-12-23']],
          // age
          ['homem | nascido em 30 | contribuinte desde 50', ['1990-01-01', '1990-01-01']],
          ['homem | nascido em 60 | contribuinte desde 70', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/geral', requisites.total.general.female, [
          ['mulher | nascida em 20 | contribuinte desde 55', ['1984-12-24', '1984-12-24']],
          ['mulher | nascida em 20 | contribuinte entre 55^60 | contribuinte desde 70', ['1994-12-25', '1994-12-25']],
          ['mulher | nascida em 20 | contribuinte desde 1968-12-23', ['1998-12-16', '1998-12-16']],
          ['mulher | nascida em 20 | contribuinte desde 95', [null, '2024-12-24']],
          // age
          ['mulher | nascido em 35 | contribuinte desde 50', ['1990-01-01', '1990-01-01']],
          ['mulher | nascido em 65 | contribuinte desde 70', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/professor', requisites.total.teacher.male, [
          ['homem | nascido em 20 | professor desde 55', ['1984-12-24', '1984-12-24']],
          ['homem | nascido em 20 | professor entre 55^60 | professor desde 70', ['1994-12-25', '1994-12-25']],
          ['homem | nascido em 20 | professor desde 1968-12-23', ['1998-12-16', '1998-12-16']],
          ['homem | nascido em 20 | professor desde 95', [null, '2024-12-24']],
          // age
          ['homem | nascido em 35 | professor desde 50', ['1990-01-01', '1990-01-01']],
          ['homem | nascido em 65 | professor desde 50', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/professor', requisites.total.teacher.female, [
          ['mulher | nascida em 20 | professora desde 60', ['1984-12-25', '1984-12-25']],
          ['mulher | nascida em 20 | professora entre 55^60 | professora desde 75', ['1994-12-26', '1994-12-26']],
          ['mulher | nascida em 20 | professora desde 1973-12-23', ['1998-12-17', '1998-12-17']],
          ['mulher | nascida em 20 | professora desde 2000', [null, '2024-12-25']],
          // age
          ['mulher | nascido em 40 | professora desde 50', ['1990-01-01', '1990-01-01']],
          ['mulher | nascido em 70 | professora desde 50', [null, NEVER]],
        ])
      })

      // // prettier-ignore
      // testChain.only(null, second.requisites.chain, [
      //   // reached before promulgation:
      //   ['homem | nascido em 30 | servidor desde 50', [promulgation, promulgation]], //                                 60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >5 anos no último ✅
      //   ['mulher | nascida em 30 | servidor desde 50', [promulgation, promulgation]], //                                55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >5 anos no último ✅

      //   // homem

      //   // by contrib:
      //   ['homem | nascido em 30 | contribuinte entre 50^60 | servidor desde 90', ['2014-12-24', '2014-12-24']], //      60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   ['homem | nascido em 30 | contribuinte entre 50^60 | servidor desde 95', [null, '2019-12-24']], //              60 anos ✅, contribuindo 33 ❌, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // by age:
      //   ['homem | nascido em 50 | servidor desde 50', ['2010-01-01', '2010-01-01']], //                                 60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   ['homem | nascido em 60 | servidor desde 50', [null, NEVER]], //                                                59 anos ❌, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // by career:
      //   ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2001', ['2010-12-30', '2010-12-30']], //        60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // // by last:
      //   // ['homem | nascido em 30 | servidor entre 50^00, em 1 | servidor desde 2000, em 1', ['2004-12-31', '2004-12-31']], //        60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // @TODO: this should be ok, as last one isn't needed to fulfil
      //   // requirements in time!
      //   // ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [null, NEVER]], //                       60 anos ✅, contribuindo 35 ✅, servidor por >20 ✅, >10 anos de carreira ✅ <5 anos no último ❌

      //   // female

      //   // by contrib:
      //   ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 1995', ['2014-12-27', '2014-12-27']], //    55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 2005', [null, '2024-12-27']], //            55 anos ✅, contribuindo 28 ❌, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // by age:
      //   ['mulher | nascida em 60 | servidora desde 50', ['2015-01-01', '2015-01-01']], //                               55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   ['mulher | nascida em 70 | servidora desde 50', [null, NEVER]], //                                              54 anos ❌, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // // by last:
      //   // ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 1995', ['1999-12-31', '1999-12-31']], //     55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // // @TODO: this should be ok, as last one isn't needed to fulfil
      //   // // requirements in time!
      //   // ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [null, NEVER]], //                    55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ <5 anos no último ❌
      //   // // by public service
      //   // ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1990', ['1999-12-30', '1999-12-30']], //  55 anos ✅, contribuindo 30 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1995', [null, '2004-12-29']], //          55 anos ✅, contribuindo 30 ✅, servidora por <20 ❌, >10 anos de carreira ❌ >5 anos no último ✅

      //   // /**
      //   //  * Teacher
      //   //  *
      //   //  * § 5º - Os requisitos de idade e de tempo de contribuição serão reduzidos em
      //   //  * cinco anos, em relação ao disposto no § 1º, III, "a", para o professor que
      //   //  * comprove exclusivamente tempo de efetivo exercício das funções de
      //   //  * magistério na educação infantil e no ensino fundamental e médio.
      //   //  */

      //   // // homem

      //   // // by contrib:
      //   // ['homem | nascido em 30 | professor entre 50^67 | professor desde 90', ['2002-12-25', '2002-12-25']], //    55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // ['homem | nascido em 30 | professor entre 50^67 | professor desde 92', [null, '2004-12-24']], //            55 anos ✅, contribuindo 28 ❌, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // // by age:
      //   // ['homem | nascido em 48 | professor desde 50', ['2003-01-01', '2003-01-01']], //                            55 anos ✅, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // ['homem | nascido em 49 | professor desde 50', [null, NEVER]], //                                           54 anos ❌, contribuindo 30 ✅, servidor por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅

      //   // // female

      //   // // by contrib:
      //   // ['mulher | nascida em 35 | professora entre 50^62 | professora desde 90', ['2002-12-26', '2002-12-26']], // 50 anos ✅, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // ['mulher | nascida em 35 | professora entre 50^62 | professora desde 92', [null, '2004-12-25']], //         50 anos ✅, contribuindo 23 ❌, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // // by age:
      //   // ['mulher | nascida em 53 | professora desde 50', ['2003-01-01', '2003-01-01']], //                          50 anos ✅, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      //   // ['mulher | nascida em 54 | professora desde 50', [null, NEVER]], //                                         49 anos ❌, contribuindo 25 ✅, servidora por >20 ✅, >10 anos de carreira ✅ >5 anos no último ✅
      // ])
    })
  })
})
