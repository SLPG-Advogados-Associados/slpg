/* cspell: disable */
import { Gender, Post, ServiceKind, Contribution } from '../types'
import { conditions } from './1998-ec-20-transition'

const { MALE: M, FEMALE: F } = Gender
const { TEACHER } = Post

/**
 *
 * @param year Year in "YYYY" or "YY" format.
 */
const yearToDate = (year: string) =>
  new Date(year.length < 4 ? `${year[0] === '0' ? '20' : '19'}${year}` : year)

/**
 * Generates a valid 1998-ec-20-transition rule input.
 */
const i = (gender: Gender, birth: string, contributions: Contribution[]) => ({
  gender,
  birthDate: yearToDate(birth),
  contributions,
})

/**
 * Generates a valid contribution time.
 */
const c = ([start, end]: [string, string?], post = Post.OTHER) => ({
  start: yearToDate(start),
  end: end ? yearToDate(end) : undefined,
  salary: 1000,
  service: { kind: ServiceKind.PUBLIC, post },
})

describe('retirement/calculator/rules/1998-ec-20-transition', () => {
  describe('conditions', () => {
    /**
     * I - tiver cinqüenta e três anos de idade, se homem, e quarenta e oito anos
     * de idade, se mulher;
     *
     * II - tiver cinco anos de efetivo exercício no cargo em que se dará a
     * aposentadoria;
     *
     * III - contar tempo de contribuição igual, no mínimo, à soma de:
     *
     * a) trinta e cinco anos, se homem, e trinta anos, se mulher; e
     *
     * b) um período adicional de contribuição equivalente a vinte por cento do
     * tempo que, na data da publicação desta Emenda, faltaria para atingir o
     * limite de tempo constante da alínea anterior.
     */
    describe('integral', () => {
      const condition = conditions[0]

      it.each([
        // male
        [i(M, '49', [c(['67', '77']), c(['77'])]), true], //   male, 54 ✅, contributing 36 ✅, last more than 5 ✅
        [i(M, '51', [c(['67', '77']), c(['77'])]), false], //  male, 52 ❌, contributing 36 ✅, last more than 5 ✅
        [i(M, '49', [c(['67', '77']), c(['79'])]), false], //  male, 54 ✅, contributing 34 ❌, last more than 5 ✅
        [i(M, '49', [c(['67', '00']), c(['00'])]), false], //  male, 54 ✅, contributing 36 ✅, last less than 5 ❌
        // female
        [i(F, '54', [c(['72', '77']), c(['77'])]), true], //   female, 49 ✅, contributing 31 ✅, last more than 5 ✅
        [i(F, '56', [c(['72', '77']), c(['77'])]), false], //  female, 47 ❌, contributing 31 ✅, last more than 5 ✅
        [i(F, '54', [c(['72', '77']), c(['79'])]), false], //  female, 49 ✅, contributing 29 ❌, last more than 5 ✅
        [i(F, '54', [c(['72', '00']), c(['00'])]), false], //  female, 49 ✅, contributing 31 ✅, last less than 5 ❌
      ])('should check qualification', (input, satisfied) => {
        expect(condition(input)[0]).toBe(satisfied)
      })

      // prettier-ignore
      it('should be always integral', () => {
        expect(condition(i(M, '50', [c(['65'])]))[1].integrality).toBe(true)
        expect(condition(i(M, '50', [c(['80'])]))[1].integrality).toBe(true)
      })
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
    describe('proportional', () => {
      const condition = conditions[1]

      it.each([
        // male
        [i(M, '49', [c(['67', '77']), c(['82'])]), true], //   male, 54 ✅, contributing 31 ✅, last more than 5 ✅
        [i(M, '51', [c(['67', '77']), c(['82'])]), false], //  male, 52 ❌, contributing 31 ✅, last more than 5 ✅
        [i(M, '49', [c(['67', '77']), c(['84'])]), false], //  male, 54 ✅, contributing 29 ❌, last more than 5 ✅
        [i(M, '49', [c(['67', '95']), c(['00'])]), false], //  male, 54 ✅, contributing 31 ✅, last less than 5 ❌
        // female
        [i(F, '54', [c(['72', '77']), c(['82'])]), true], //   female, 49 ✅, contributing 26 ✅, last more than 5 ✅
        [i(F, '56', [c(['72', '77']), c(['82'])]), false], //  female, 47 ❌, contributing 26 ✅, last more than 5 ✅
        [i(F, '54', [c(['72', '77']), c(['84'])]), false], //  female, 49 ✅, contributing 24 ❌, last more than 5 ✅
        [i(F, '54', [c(['72', '95']), c(['00'])]), false], //  female, 49 ✅, contributing 26 ✅, last less than 5 ❌
      ])('should check qualification', (input, satisfied) => {
        expect(condition(input)[0]).toBe(satisfied)
      })

      // prettier-ignore
      it('should be always NOT integral', () => {
        expect(condition(i(M, '50', [c(['65'])]))[1].integrality).toBe(false)
        expect(condition(i(M, '50', [c(['90'])]))[1].integrality).toBe(false)
      })
    })

    /*
     * § 2º - Aplica-se ao magistrado e ao membro do Ministério Público e de
     * Tribunal de Contas o disposto neste artigo.
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
    describe('teacher', () => {
      describe('integral', () => {
        const T = TEACHER
        const condition = conditions[0]

        it.each([
          // male
          [i(M, '49', [c(['67', '77'], T), c(['77'], T)]), true], //   male, teacher, 54 ✅, contributing 36 ✅, last more than 5 ✅
          [i(M, '49', [c(['67', '77'], T), c(['80'], T)]), true], //   male, teacher, 54 ✅, contributing 33 ✅, last more than 5 ✅
          // [i(M, '51', [c(['67', '77'], T), c(['77'], T)]), false], //  male, teacher, 52 ❌, contributing 36 ✅, last more than 5 ✅
          // [i(M, '49', [c(['67', '77'], T), c(['79'], T)]), false], //  male, teacher, 54 ✅, contributing 34 ❌, last more than 5 ✅
          // [i(M, '49', [c(['67', '00'], T), c(['00'], T)]), false], //  male, teacher, 54 ✅, contributing 36 ✅, last less than 5 ❌
          // // female
          // [i(F, '54', [c(['72', '77'], T), c(['77'], T)]), true], //   female, teacher, 49 ✅, contributing 31 ✅, last more than 5 ✅
          // [i(F, '56', [c(['72', '77'], T), c(['77'], T)]), false], //  female, teacher, 47 ❌, contributing 31 ✅, last more than 5 ✅
          // [i(F, '54', [c(['72', '77'], T), c(['79'], T)]), false], //  female, teacher, 49 ✅, contributing 29 ❌, last more than 5 ✅
          // [i(F, '54', [c(['72', '00'], T), c(['00'], T)]), false], //  female, teacher, 49 ✅, contributing 31 ✅, last less than 5 ❌
        ])('should check qualification', (input, satisfied) => {
          expect(condition(input)[0]).toBe(satisfied)
        })

        // // prettier-ignore
        // it('should be always integral', () => {
        //   expect(condition(i(M, '50', [c(['65'], T)]))[1].integrality).toBe(true)
        //   expect(condition(i(M, '50', [c(['80'], T)]))[1].integrality).toBe(true)
        // })
      })
    })
  })
})
