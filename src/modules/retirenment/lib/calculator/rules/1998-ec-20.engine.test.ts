/* cspell: disable */
import { testChain } from '../lib/test-utils'
import { NEVER } from '../lib/const'
// @ts-ignore
import { rule } from './1998-ec-20.engine'

const { promulgation } = rule

describe('retirement/calculator/rules/1998-ec-20.engine', () => {
  describe('possibilities', () => {
    const [integral, proportional] = rule.possibilities

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
      describe('Requisitos', () => {
        const requisites = {
          public: integral.requisites.getChain('all.1'),
          last: integral.requisites.getChain('all.2'),
          total: {
            general: {
              male: integral.requisites.getChain('all.3.any.0.all.1.any.0'),
              female: integral.requisites.getChain('all.3.any.1.all.1.any.0'),
            },
            teacher: {
              male: integral.requisites.getChain('all.3.any.0.all.1.any.1'),
              female: integral.requisites.getChain('all.3.any.1.all.1.any.1'),
            },
          },
        }

        // prettier-ignore
        testChain(requisites.public.title, requisites.public, [
          ['homem | nascido em 40', [null]],
          ['mulher | nascida em 40', [null]],
          ['homem | nascido em 40 | contribuinte desde 50', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 50', [null, NEVER]],
          ['homem | nascido em 40 | servidor desde 50', ['1959-12-30', '1959-12-30']],
          ['mulher | nascida em 40 | servidora desde 50', ['1959-12-30', '1959-12-30']],
          ['homem | nascido em 40 | contribuinte desde 2000', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 2000', [null, NEVER]],
        ])

        // prettier-ignore
        testChain(requisites.last.title, requisites.last, [
          ['homem | nascido em 40', [NEVER]],
          ['mulher | nascida em 40', [NEVER]],
          ['homem | nascido em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['mulher | nascida em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['homem | nascido em 40 | contribuinte desde 2000', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 2000', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/geral', requisites.total.general.male, [
          ['homem | nascido em 20 | contribuinte desde 50', ['1984-12-23', '1984-12-23']],
          ['homem | nascido em 20 | contribuinte entre 50^60 | contribuinte desde 70', ['1994-12-24', '1994-12-24']],
          ['homem | nascido em 20 | contribuinte desde 1963-12-25', ['1998-12-16', '1998-12-16']],
          ['homem | nascido em 20 | contribuinte desde 80', [null, '2014-12-23']],
          // age
          ['homem | nascido em 30 | contribuinte desde 50', ['1990-01-01', '1990-01-01']],
          ['homem | nascido em 50 | contribuinte desde 50', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/geral', requisites.total.general.female, [
          ['mulher | nascida em 20 | contribuinte desde 55', ['1984-12-24', '1984-12-24']],
          ['mulher | nascida em 20 | contribuinte entre 55^60 | contribuinte desde 70', ['1994-12-25', '1994-12-25']],
          ['mulher | nascida em 20 | contribuinte desde 1968-12-23', ['1998-12-16', '1998-12-16']],
          ['mulher | nascida em 20 | contribuinte desde 85', [null, '2014-12-25']],
          // age
          ['mulher | nascido em 35 | contribuinte desde 50', ['1990-01-01', '1990-01-01']],
          ['mulher | nascido em 55 | contribuinte desde 50', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/professor', requisites.total.teacher.male, [
          ['homem | nascido em 20 | professor desde 55', ['1984-12-24', '1984-12-24']],
          ['homem | nascido em 20 | professor entre 55^60 | professor desde 70', ['1994-12-25', '1994-12-25']],
          ['homem | nascido em 20 | professor desde 1968-12-23', ['1998-12-16', '1998-12-16']],
          ['homem | nascido em 20 | professor desde 85', [null, '2014-12-25']],
          // age
          ['homem | nascido em 35 | professor desde 50', ['1990-01-01', '1990-01-01']],
          ['homem | nascido em 55 | professor desde 50', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade e tempo de contribuição/professor', requisites.total.teacher.female, [
          ['mulher | nascida em 20 | professora desde 60', ['1984-12-25', '1984-12-25']],
          ['mulher | nascida em 20 | professora entre 55^60 | professora desde 75', ['1994-12-26', '1994-12-26']],
          ['mulher | nascida em 20 | professora desde 1973-12-23', ['1998-12-17', '1998-12-17']],
          ['mulher | nascida em 20 | professora desde 90', [null, '2014-12-26']],
          // age
          ['mulher | nascido em 40 | professora desde 50', ['1990-01-01', '1990-01-01']],
          ['mulher | nascido em 60 | professora desde 50', [null, NEVER]],
        ])
      })

      // prettier-ignore
      testChain(null, integral.requisites.chain, [        
        // reached before promulgation:
        ['homem | nascido em 30 | servidor desde 50', [promulgation, promulgation]], //                                 60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidor desde 50', [promulgation, promulgation]], //                                55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅

        // homem

        // by contrib:
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 90', ['2002-12-24', '2002-12-24']], //      60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^72 | servidor desde 92', [null, '2004-12-23']], //              60 anos ✅, contribuindo 33 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 43 | servidor desde 50', ['2003-01-01', '2003-01-01']], //                                 60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 44 | servidor desde 50', [null, NEVER]], //                                                59 anos ❌, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 1995', ['1999-12-31', '1999-12-31']], //        60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [null, NEVER]], //                       60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1990', ['1999-12-30', '1999-12-30']], //    60 anos ✅, contribuindo 35 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1995', [null, '2004-12-29']], //            60 anos ✅, contribuindo 35 ✅, servidor por <10 ❌, >5 anos no último ✅

        // female

        // by contrib:
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 90', ['2002-12-25', '2002-12-25']], //    55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^67 | servidora desde 92', [null, '2004-12-24']], //            55 anos ✅, contribuindo 28 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 48 | servidora desde 50', ['2003-01-01', '2003-01-01']], //                               55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 49 | servidora desde 50', [null, NEVER]], //                                              54 anos ❌, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 1995', ['1999-12-31', '1999-12-31']], //     55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [null, NEVER]], //                    55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1990', ['1999-12-30', '1999-12-30']], //  55 anos ✅, contribuindo 30 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1995', [null, '2004-12-29']], //          55 anos ✅, contribuindo 30 ✅, servidora por <10 ❌, >5 anos no último ✅

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
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 90', ['2002-12-25', '2002-12-25']], //    55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | professor entre 50^67 | professor desde 92', [null, '2004-12-24']], //            55 anos ✅, contribuindo 28 ❌, servidor por >10 ✅, >5 anos no último ✅
        // by age:
        ['homem | nascido em 48 | professor desde 50', ['2003-01-01', '2003-01-01']], //                            55 anos ✅, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 49 | professor desde 50', [null, NEVER]], //                                           54 anos ❌, contribuindo 30 ✅, servidor por >10 ✅, >5 anos no último ✅

        // female

        // by contrib:
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 90', ['2002-12-26', '2002-12-26']], // 50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 35 | professora entre 50^62 | professora desde 92', [null, '2004-12-25']], //         50 anos ✅, contribuindo 23 ❌, servidora por >10 ✅, >5 anos no último ✅
        // by age:
        ['mulher | nascida em 53 | professora desde 50', ['2003-01-01', '2003-01-01']], //                          50 anos ✅, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 54 | professora desde 50', [null, NEVER]], //                                         49 anos ❌, contribuindo 25 ✅, servidora por >10 ✅, >5 anos no último ✅
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
      describe('Requisitos', () => {
        const requisites = {
          public: proportional.requisites.getChain('all.1'),
          last: proportional.requisites.getChain('all.2'),
          age: {
            male: proportional.requisites.getChain('all.3.any.0'),
            female: proportional.requisites.getChain('all.3.any.1'),
          },
        }

        // prettier-ignore
        testChain(requisites.public.title, requisites.public, [
          ['homem | nascido em 40', [null]],
          ['mulher | nascida em 40', [null]],
          ['homem | nascido em 40 | contribuinte desde 50', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 50', [null, NEVER]],
          ['homem | nascido em 40 | servidor desde 50', ['1959-12-30', '1959-12-30']],
          ['mulher | nascida em 40 | servidora desde 50', ['1959-12-30', '1959-12-30']],
          ['homem | nascido em 40 | contribuinte desde 2000', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 2000', [null, NEVER]],
        ])

        // prettier-ignore
        testChain(requisites.last.title, requisites.last, [
          ['homem | nascido em 40', [NEVER]],
          ['mulher | nascida em 40', [NEVER]],
          ['homem | nascido em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['mulher | nascida em 40 | contribuinte desde 50', ['1954-12-31', '1954-12-31']],
          ['homem | nascido em 40 | contribuinte desde 2000', [null, NEVER]],
          ['mulher | nascida em 40 | contribuinte desde 2000', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade', requisites.age.male, [
          ['homem | nascido em 30 | contribuinte desde 50', ['1995-01-01', NEVER]],
          ['homem | nascido em 50 | contribuinte desde 50', [null, NEVER]],
        ])

        // prettier-ignore
        testChain('Idade', requisites.age.female, [
          ['mulher | nascido em 35 | contribuinte desde 50', ['1995-01-01', NEVER]],
          ['mulher | nascido em 55 | contribuinte desde 50', [null, NEVER]],
        ])
      })

      // prettier-ignore
      testChain(null, proportional.requisites.chain, [        
        // reached before promulgation:
        ['homem | nascido em 30 | servidor desde 50', [promulgation, promulgation]], //                                 65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | servidor desde 50', [promulgation, promulgation]], //                                60 anos ✅, servidor por >10 ✅, >5 anos no último ✅

        // homem

        // by age:
        ['homem | nascido em 38 | servidor desde 50', ['2003-01-01', '2003-01-01']], //                                 65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 39 | servidor desde 50', [null, NEVER]], //                                                64 anos ❌, servidor por >10 ✅, >5 anos no último ✅
        // by last:
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 1995', ['1999-12-31', '1999-12-31']], //        65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['homem | nascido em 30 | servidor entre 50^00 | servidor desde 2000', [null, NEVER]], //                       65 anos ✅, servidor por >10 ✅, <5 anos no último ❌
        // by public service
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1990', ['1999-12-30', '1999-12-30']], //    65 anos ✅, servidor por >10 ✅, >5 anos no último ✅
        ['homem | nascido em 30 | contribuinte entre 50^00 | servidor desde 1995', [null, '2004-12-29']], //            65 anos ✅, servidor por <10 ❌, >5 anos no último ✅

        // female

        // by age:
        ['mulher | nascida em 43 | servidora desde 50', ['2003-01-01', '2003-01-01']], //                               60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 44 | servidora desde 50', [null, NEVER]], //                                              59 anos ❌, servidora por >10 ✅, >5 anos no último ✅
        // by last:
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 1995', ['1999-12-31', '1999-12-31']], //     60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        // @TODO: this should be ok, as last one isn't needed to fulfil
        // requirements in time!
        ['mulher | nascida em 30 | servidora entre 50^00 | servidora desde 2000', [null, NEVER]], //                    60 anos ✅, servidora por >10 ✅, <5 anos no último ❌
        // by public service
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1990', ['1999-12-30', '1999-12-30']], //  60 anos ✅, servidora por >10 ✅, >5 anos no último ✅
        ['mulher | nascida em 30 | contribuinte entre 50^00 | servidora desde 1995', [null, '2004-12-29']], //          60 anos ✅, servidora por <10 ❌, >5 anos no último ✅
      ])
    })
  })
})
