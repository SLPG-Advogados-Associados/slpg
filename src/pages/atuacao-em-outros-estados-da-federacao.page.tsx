import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const StaticPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>Atuação em outros estados da federação</Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Além de clientes sediados no Estado de Santa Catarina, onde temos
            nossa sede, e da nossa atuação articulada com outros escritórios,
            através do CNASP ou da SCP/DF, nosso escritório atua também em
            outros Estados, representando judicialmente entidades sindicais de
            servidores públicos lá sediadas, o que fazemos sempre em sociedade
            com um ou mais escritórios de advocacia.
          </p>
          <p>
            É o caso de MInas Gerais, onde ao lado dos Escritórios{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.tea.adv.br/"
            >
              Trindade &amp; Arzeno - Advogados Associados
            </a>
            , com sede em Curitiba/PR, e{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.paeseferreira.com.br"
            >
              Paese, Ferreira &amp; Advogados Associados
            </a>
            , com sede em Porto Alegre/RS, assessoramos o{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.sintsprevmg.org.br"
            >
              SINTSPREV
            </a>{' '}
            - Sindicato dos Trabalhadores em Seguridade Social, Saúde,
            Previdência, Trabalho e Assistência Social; de Goiás e Tocantins,
            onde ao lado do Escritório Josilma Saraiva - Advogados Associados,
            com sede em Brasília, assessoramos o{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.sintfesp.org.br"
            >
              SINTFESP
            </a>{' '}
            - Sindicato dos Trabalhadores Federais em Saúde e Previdência de
            Goiás e Tocantins; e de São Paulo, onde também ao lado dos
            Escritórios{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.tea.adv.br/"
            >
              Trindade &amp; Arzeno - Advogados Associados
            </a>
            , com sede em Curitiba/PR, e{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.paeseferreira.com.br"
            >
              Paese, Ferreira &amp; Advogados Associados
            </a>
            , com sede em Porto Alegre/RS, assessoramos o{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://www.sinsprev.org.br"
            >
              SINSPREV
            </a>{' '}
            - Sindicato dos Trabalhadores em Saúde e Previdência no Estado de
            São Paulo, neste caso mais especificamente na execução de processos
            ajuizados pela entidade há alguns anos atrás, ainda com outras
            assessorias jurídicas, como são os casos daqueles relacionados ao
            reajuste de 3,17% (de janeiro de 1995), o reajuste de 28,86% (de
            janeiro de 1993),e &nbsp;o reajuste do PCCS (de janeiro de 1988).
          </p>
          <p>
            Para saber dos processos judiciais em que atuamos nos Estados
            referidos acima, o interessado deve procurar diretamente as
            entidades sindicais respectivas, nos horários disponibilizados em
            seus sítios na internet.
          </p>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
