/* cspell: disable */
import { testChain } from '../lib/test-utils'
import { rule } from './2003-ec-41-permanent.engine'

const { promulgation, due } = rule

describe('retirement/calculator/rules/2003-ec-41.permanent.engine', () => {
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
      // prettier-ignore
      testChain(null, integral.requisites.chain, [        
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
      testChain(null, proportional.requisites.chain, [        
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
})
