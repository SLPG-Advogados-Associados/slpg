import React from 'react'
import { Page } from '~app/components/Page'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const PostPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>Atuação nos Tribunais Superiores</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Todos os processos judiciais movidos contra órgãos públicos, sejam
            eles federais, estaduais ou municipais, implica na tramitação dos
            respectivos processos por pelo menos dois graus de jurisdição, ou
            seja, por pelo menos duas instâncias.
          </p>
          <p>
            No específico caso de demandas judiciais que envolvam servidores
            federais, por exemplo, este “segundo grau” equivale à remessa do
            processo para a Turma Recursal do Juizado Especial Federal, com sede
            em Santa Catarina, ou para uma das Turmas especializadas em direito
            administrativo, em funcionamento junto ao Tribunal Regional Federal
            da 4ª Região, com sede em Porto Alegre.
          </p>
          <p>
            Para que possamos acompanhar estes processos com o cuidado que eles
            requerem, portanto, além de atuar mais fortemente sobre os
            julgamentos a cargo da Turma Recursal do Juizado Especial Federal
            (que não requer deslocamentos), precisamos atuar diretamente no
            Tribunal Regional Federal, em Porto Alegre, para onde advogados(as)
            do nosso escritório se deslocam semanalmente, seja para sustentar
            nossas teses jurídicas junto aos Desembargadores Federais, para
            fazer a entrega de memoriais, ou para proceder à sustentação oral
            dos processos nas respectivas sessões de julgamento naquela Corte.
          </p>
          <p>
            Já a atuação junto aos tribunais superiores (como o Superior
            Tribunal de Justiça - STJ, o Tribunal Superior do Trabalho - TST, e
            o Supremo Tribunal Federal - STF), para onde estes processos
            normalmente seguem em grau de recurso, também requer uma atuação
            mais constante de nossa parte, com os mesmos objetivos acima, o que
            muitas vezes é dificultada pela distância física, pelos custos
            envolvidos, e pela dificuldade de agenda pré-determinada com os
            Ministros destes tribunais superiores, que recebem advogados de todo
            o País.
          </p>
          <p>
            Para tentar contornar esta dificuldade, nosso escritório se
            integrou, em 2016, a uma sociedade de escritórios que comungam das
            mesmas necessidades e compartilham dos mesmos pontos de vista,
            organizados em torno de uma Sociedade em Cota de Participação (SCP),
            com sede em Brasília, tornando-se sócio desta instituição, da qual
            participam também os Escritório{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.tea.adv.br/"
            >
              Trindade &amp; Arzeno - Advogados Associados
            </a>
            , com sede em Curitiba/PR,{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.bordas.adv.br/"
            >
              Bordas Advogados Associados
            </a>
            , com sede em Porto Alegre/RS, e{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://claudiosantos.adv.br/"
            >
              Cláudio Santos Advogados
            </a>
            , com sede em Brasília, sociedade esta que terá exatamente a
            responsabilidade de atuar mais diretamente junto a estes tribunais
            superiores, reduzindo os custos constantes de deslocamentos à
            capital federal e uniformizando nossa atuação naquelas cortes, com
            vantagens sensíveis aos nossos clientes.
          </p>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default PostPage
