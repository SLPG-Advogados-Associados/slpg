import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { Heading, HTMLContent } from '~design'
import { Section } from '~app/components/Section'

const StaticPage = () => (
  <Page>
    <div className="bg-reverse text-white py-8">
      <Heading noMargins>
        O Coletivo Nacional de Advogados de Servidores Públicos
      </Heading>
    </div>

    <main>
      <Section>
        <HTMLContent>
          <p>
            Quando um escritório de advocacia atua preponderantemente na defesa
            dos direitos dos servidores públicos e dos trabalhadores do setor
            privado, de maneira geral, as teses por ele sustentadas normalmente
            repercutem em outras Unidades da Federação, onde também existem
            trabalhadores lutando judicialmente por seus direitos, situação que
            assume ainda maior relevância quando tratamos de servidores públicos
            federais, sujeitos à uma única legislação no plano nacional.
          </p>
          <p>
            Isto significa dizer que nossa atuação jurídica precisa ocorrer de
            forma articulada com as assessorias jurídicas de entidades sindicais
            ou associativas semelhantes, sediadas em outros Estados, até porque
            a defesa da parte contrária (União Federal, suas autarquias e
            fundações) se dá também de forma articulada e coesa, através dos
            respectivos órgãos de representação judicial.
          </p>
          <p>
            Por outro lado, significa também dizer que a qualidade dos serviços
            que prestamos guarda íntima relação com nossa capacidade de
            articulação nacional com outros escritórios de advocacia, sendo
            maior quanto maior e mais profundas estas relações.
          </p>
          <p>
            Foi com este horizonte em mente que no mês de janeiro de 2006 o
            nosso escritório, juntamente com escritórios sediados em diversos
            outros Estados, resolveram constituir o{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://cnasp.com.br/"
            >
              CNASP - Coletivo Nacional de Advogados de Servidores Públicos
            </a>
            , que tem por finalidade principal a construção de um espaço
            democrático de debate permanente sobre questões jurídicas de
            interesse dos servidores públicos e dos trabalhadores de maneira
            geral, buscando sempre o aperfeiçoamento e a uniformidade das teses
            jurídicas que defendemos, &nbsp;a socialização livre do conhecimento
            adquirido, a instituição de uma fonte alternativa de pesquisa
            jurídica para os operadores do direito, e o aprimoramento da atuação
            profissional dos escritórios de advocacia que compõem o Coletivo.
          </p>
          <p>
            Nestes mais de 10 anos de fundação, o CNASP já foi responsável por
            diversas medidas conjuntas, empregadas junto ao STJ e ao STF, e que
            têm sido fundamentais para que os Ministros que compõem estes
            tribunais se disponham a ouvir os advogados (sobretudo aqueles que
            defendem servidores públicos), abrindo-se à discussão sobre temas de
            interesse destes servidores.
          </p>
        </HTMLContent>
      </Section>
    </main>
  </Page>
)

export default withGraphQL(StaticPage)
